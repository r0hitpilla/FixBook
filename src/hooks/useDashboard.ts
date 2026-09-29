import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { Asset, MaintenanceTask } from '@/types/models';

export interface DashboardData {
  totalAssets: number;
  upcomingCount: number;
  spendThisYear: number;
  needsAttention: (MaintenanceTask & { asset: Pick<Asset, 'id' | 'name' | 'category' | 'cover_photo_url'> })[];
  recentlyAdded: Asset[];
  categoryCounts: Record<string, number>;
}

export function useDashboard() {
  const userId = useAuthStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['dashboard', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<DashboardData> => {
      const yearStart = `${new Date().getFullYear()}-01-01`;

      const [assetsRes, tasksRes, expensesRes] = await Promise.all([
        supabase.from('assets').select('*').eq('is_archived', false).order('created_at', { ascending: false }),
        supabase
          .from('maintenance_tasks')
          .select('*, asset:assets(id, name, category, cover_photo_url)')
          .neq('status', 'completed')
          .order('due_date', { ascending: true })
          .limit(5),
        supabase.from('expenses').select('amount').gte('incurred_at', yearStart),
      ]);

      if (assetsRes.error) throw assetsRes.error;
      if (tasksRes.error) throw tasksRes.error;
      if (expensesRes.error) throw expensesRes.error;

      const assets = assetsRes.data as Asset[];
      const categoryCounts = assets.reduce<Record<string, number>>((acc, a) => {
        acc[a.category] = (acc[a.category] ?? 0) + 1;
        return acc;
      }, {});
      const spendThisYear = (expensesRes.data ?? []).reduce((sum: number, e: { amount: number }) => sum + Number(e.amount), 0);

      return {
        totalAssets: assets.length,
        upcomingCount: (tasksRes.data ?? []).length,
        spendThisYear,
        needsAttention: (tasksRes.data ?? []) as DashboardData['needsAttention'],
        recentlyAdded: assets.slice(0, 6),
        categoryCounts,
      };
    },
  });
}
