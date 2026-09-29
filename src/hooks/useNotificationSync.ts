import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useProfile } from './useProfile';
import { requestNotificationPermission, scheduleLocalReminder } from '@/lib/notifications';
import type { MaintenanceTask, Warranty } from '@/types/models';

const REMINDER_LEAD_DAYS = 3;

function reminderFireDate(dueDateIso: string): Date {
  const due = new Date(dueDateIso);
  const fireDate = new Date(due);
  fireDate.setDate(fireDate.getDate() - REMINDER_LEAD_DAYS);
  fireDate.setHours(9, 0, 0, 0);
  // If the lead-time date has already passed, fire the morning of the due date instead.
  if (fireDate.getTime() <= Date.now()) {
    fireDate.setTime(due.getTime());
    fireDate.setHours(9, 0, 0, 0);
  }
  return fireDate;
}

/**
 * Schedules on-device local notifications for upcoming maintenance tasks and
 * expiring warranties, respecting the user's saved notification preferences.
 * Re-runs whenever the underlying data changes and is idempotent (each
 * reminder has a deterministic identifier, so re-syncing just replaces the
 * existing scheduled notification rather than duplicating it).
 */
export function useNotificationSync() {
  const userId = useAuthStore((s) => s.session?.user.id);
  const { data: profile } = useProfile();

  const { data: upcomingTasks } = useQuery({
    queryKey: ['notify_tasks', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*, assets(name)')
        .neq('status', 'completed')
        .not('due_date', 'is', null);
      if (error) throw error;
      return data as (MaintenanceTask & { assets: { name: string } | null })[];
    },
  });

  const { data: upcomingWarranties } = useQuery({
    queryKey: ['notify_warranties', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from('warranties').select('*, assets(name)');
      if (error) throw error;
      return data as (Warranty & { assets: { name: string } | null })[];
    },
  });

  useEffect(() => {
    if (!profile) return;
    requestNotificationPermission().then((granted) => {
      if (!granted) return;

      if (profile.notification_prefs.maintenance) {
        for (const task of upcomingTasks ?? []) {
          if (!task.due_date) continue;
          scheduleLocalReminder({
            identifier: `task-${task.id}`,
            title: `${task.assets?.name ?? 'Asset'} maintenance due`,
            body: task.title,
            fireDate: reminderFireDate(task.due_date),
            data: { taskId: task.id, type: 'maintenance' },
          });
        }
      }

      if (profile.notification_prefs.warranty) {
        for (const warranty of upcomingWarranties ?? []) {
          scheduleLocalReminder({
            identifier: `warranty-${warranty.id}`,
            title: `${warranty.assets?.name ?? 'Asset'} warranty expiring soon`,
            body: warranty.coverage_summary ?? 'Your warranty coverage is ending soon.',
            fireDate: reminderFireDate(warranty.expiry_date),
            data: { warrantyId: warranty.id, type: 'warranty' },
          });
        }
      }
    });
  }, [profile, upcomingTasks, upcomingWarranties]);
}
