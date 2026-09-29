import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Expense } from '@/types/models';

export function useAssetExpenses(assetId: string | undefined, year?: number) {
  return useQuery({
    queryKey: ['expenses', assetId, year],
    enabled: Boolean(assetId),
    queryFn: async () => {
      let query = supabase.from('expenses').select('*').eq('asset_id', assetId);
      if (year) {
        query = query.gte('incurred_at', `${year}-01-01`).lte('incurred_at', `${year}-12-31`);
      }
      const { data, error } = await query;
      if (error) throw error;
      const rows = data as Expense[];
      const total = rows.reduce((sum, e) => sum + Number(e.amount), 0);
      const byCategory = rows.reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount);
        return acc;
      }, {});
      return { rows, total, byCategory, visitCount: new Set(rows.map((e) => e.maintenance_record_id)).size };
    },
  });
}
