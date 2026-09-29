import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { Asset } from '@/types/models';

export function useAssets() {
  const userId = useAuthStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['assets', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Asset[];
    },
  });
}

export function useAsset(assetId: string | undefined) {
  return useQuery({
    queryKey: ['asset', assetId],
    enabled: Boolean(assetId),
    queryFn: async () => {
      const { data, error } = await supabase.from('assets').select('*').eq('id', assetId).single();
      if (error) throw error;
      return data as Asset;
    },
  });
}

export type NewAsset = Partial<Asset> & { name: string; category: string };

export function useCreateAsset() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.session?.user.id);
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (input: NewAsset) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('assets')
        .insert({ ...input, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data as Asset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Asset> }) => {
      const { data, error } = await supabase.from('assets').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data as Asset;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset', data.id] });
    },
  });
}

export function useCategoryCounts() {
  const { data: assets } = useAssets();
  const counts: Record<string, { count: number; hasAlert: boolean }> = {};
  for (const asset of assets ?? []) {
    if (!counts[asset.category]) counts[asset.category] = { count: 0, hasAlert: false };
    counts[asset.category].count += 1;
  }
  return counts;
}
