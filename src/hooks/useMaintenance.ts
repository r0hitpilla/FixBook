import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { MaintenanceRecord, MaintenanceTask } from '@/types/models';

export function useMaintenanceRecords(assetId: string | undefined) {
  return useQuery({
    queryKey: ['maintenance_records', assetId],
    enabled: Boolean(assetId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('asset_id', assetId)
        .order('performed_at', { ascending: false });
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
  });
}

export function useMaintenanceTasks(assetId?: string) {
  const userId = useAuthStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['maintenance_tasks', assetId ?? 'all', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      let query = supabase
        .from('maintenance_tasks')
        .select('*')
        .neq('status', 'completed')
        .order('due_date', { ascending: true });
      if (assetId) query = query.eq('asset_id', assetId);
      const { data, error } = await query;
      if (error) throw error;
      return data as MaintenanceTask[];
    },
  });
}

export function useMaintenanceTask(taskId: string | undefined) {
  return useQuery({
    queryKey: ['maintenance_task', taskId],
    enabled: Boolean(taskId),
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_tasks').select('*').eq('id', taskId).single();
      if (error) throw error;
      return data as MaintenanceTask;
    },
  });
}

export type NewMaintenanceRecord = Omit<MaintenanceRecord, 'id' | 'user_id' | 'created_at' | 'currency'> & {
  currency?: string;
};

export function useCreateMaintenanceRecord() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.session?.user.id);
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (input: NewMaintenanceRecord) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert({ currency: 'INR', ...input, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data as MaintenanceRecord;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_records', data.asset_id] });
      queryClient.invalidateQueries({ queryKey: ['asset', data.asset_id] });
    },
  });
}

export function useUpdateMaintenanceTask() {
  const queryClient = useQueryClient();
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<MaintenanceTask> }) => {
      const { data, error } = await supabase.from('maintenance_tasks').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data as MaintenanceTask;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance_task', data.id] });
    },
  });
}

export function useCompleteMaintenanceTask() {
  const queryClient = useQueryClient();
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (taskId: string) => {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .update({ status: 'completed', last_completed_at: new Date().toISOString().slice(0, 10) })
        .eq('id', taskId)
        .select()
        .single();
      if (error) throw error;
      return data as MaintenanceTask;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance_task', data.id] });
    },
  });
}
