export function formatCurrencyINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function daysUntil(iso: string): number {
  const target = new Date(iso).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86_400_000);
}

export function relativeDaysLabel(iso: string): string {
  const days = daysUntil(iso);
  if (days === 0) return 'Due today';
  if (days > 0) return `Due in ${days}d`;
  return `Overdue ${Math.abs(days)}d`;
}

export function timeAgo(iso: string): string {
  const days = Math.abs(daysUntil(iso));
  if (days === 0) return 'Today';
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months} mo ago`;
}
