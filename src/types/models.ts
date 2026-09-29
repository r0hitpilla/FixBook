export interface Asset {
  id: string;
  user_id: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  registration_number: string | null;
  cover_photo_url: string | null;
  notes: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssetPhoto {
  id: string;
  asset_id: string;
  storage_path: string;
  url: string;
  created_at: string;
}

export type DocumentKind =
  | 'invoice'
  | 'warranty_card'
  | 'product_label'
  | 'insurance'
  | 'vehicle_doc'
  | 'service_receipt'
  | 'purchase_receipt'
  | 'other';

export interface AssetDocument {
  id: string;
  asset_id: string;
  user_id: string;
  kind: DocumentKind;
  title: string;
  storage_path: string;
  url: string;
  mime_type: string;
  file_size_bytes: number;
  issued_date: string | null;
  expiry_date: string | null;
  extracted_fields: Record<string, unknown> | null;
  created_at: string;
}

export interface Warranty {
  id: string;
  asset_id: string;
  provider: string | null;
  coverage_summary: string | null;
  start_date: string | null;
  expiry_date: string;
  document_id: string | null;
  status: 'active' | 'expiring_soon' | 'expired';
}

export interface MaintenanceRecord {
  id: string;
  asset_id: string;
  user_id: string;
  title: string;
  performed_at: string;
  odometer_km: number | null;
  cost: number | null;
  currency: string;
  service_provider: string | null;
  notes: string | null;
  invoice_reference: string | null;
  document_id: string | null;
  created_at: string;
}

export interface MaintenanceTask {
  id: string;
  asset_id: string;
  user_id: string;
  title: string;
  due_date: string | null;
  due_odometer_km: number | null;
  interval_days: number | null;
  interval_km: number | null;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  estimated_cost_low: number | null;
  estimated_cost_high: number | null;
  effort_level: 'low' | 'medium' | 'high' | null;
  steps: { title: string; description?: string }[] | null;
  last_completed_at: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  asset_id: string;
  user_id: string;
  category: 'parts' | 'consumables' | 'labor_tax' | 'other';
  amount: number;
  currency: string;
  incurred_at: string;
  maintenance_record_id: string | null;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'maintenance' | 'warranty' | 'insurance' | 'document' | 'custom';
  related_asset_id: string | null;
  related_task_id: string | null;
  scheduled_for: string;
  sent_at: string | null;
  read_at: string | null;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  notes: string | null;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan: 'free' | 'plus' | 'pro';
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  current_period_end: string | null;
}

export interface ExtractedFields {
  product?: string;
  category?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  seller?: string;
  warranty_months?: number;
  confidence?: number;
}
