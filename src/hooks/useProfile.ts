import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  notification_prefs: {
    maintenance: boolean;
    warranty: boolean;
    insurance: boolean;
    documents: boolean;
  };
}

export function useProfile() {
  const userId = useAuthStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['profile', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.session?.user.id);
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (patch: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'notification_prefs'>>) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('profiles').update(patch).eq('id', userId).select().single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', userId] }),
  });
}

export function useSubscription() {
  const userId = useAuthStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['subscription', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', userId).single();
      if (error) throw error;
      return data;
    },
  });
}
