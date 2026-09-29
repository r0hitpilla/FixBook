import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { daysUntil } from '@/lib/format';
import type { Warranty } from '@/types/models';

export function useAssetWarranties(assetId: string | undefined) {
  return useQuery({
    queryKey: ['warranties', assetId],
    enabled: Boolean(assetId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('asset_id', assetId)
        .order('expiry_date', { ascending: true });
      if (error) throw error;
      return (data as Omit<Warranty, 'status'>[]).map((w) => ({
        ...w,
        status: statusFor(w.expiry_date),
      })) as Warranty[];
    },
  });
}

function statusFor(expiryDate: string): Warranty['status'] {
  const days = daysUntil(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 60) return 'expiring_soon';
  return 'active';
}

export interface NewWarranty {
  assetId: string;
  provider?: string | null;
  coverageSummary?: string | null;
  startDate?: string | null;
  expiryDate: string;
  documentId?: string | null;
}

export function useCreateWarranty() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.session?.user.id);
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (input: NewWarranty) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('warranties')
        .insert({
          user_id: userId,
          asset_id: input.assetId,
          provider: input.provider ?? null,
          coverage_summary: input.coverageSummary ?? null,
          start_date: input.startDate ?? null,
          expiry_date: input.expiryDate,
          document_id: input.documentId ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['warranties', variables.assetId] });
    },
  });
}
