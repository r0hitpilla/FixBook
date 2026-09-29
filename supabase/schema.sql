-- FixBook database schema
-- Run against a Supabase Postgres project (SQL editor or `supabase db push`).
-- Every user-owned table carries `user_id uuid references auth.users` and a
-- Row Level Security policy scoping all access to `auth.uid() = user_id`, so
-- one user can never read or write another user's rows.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (mirrors auth.users; holds app-specific fields)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  notification_prefs jsonb not null default '{"maintenance": true, "warranty": true, "insurance": true, "documents": true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Categories (system defaults, readable by everyone; no user-owned rows here)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  label text not null,
  icon text not null,
  sort_order int not null default 0
);

alter table public.categories enable row level security;
create policy "categories_read_all" on public.categories for select using (true);

insert into public.categories (id, label, icon, sort_order) values
  ('vehicles', 'Vehicles', 'two_wheeler', 1),
  ('home_appliances', 'Home Appliances', 'roofing', 2),
  ('electronics', 'Electronics', 'laptop_mac', 3),
  ('cameras_gear', 'Cameras & Gear', 'photo_camera', 4),
  ('tools_equipment', 'Tools & Workshop Equipment', 'home_repair_service', 5),
  ('other', 'Other', 'inventory_2', 6)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Assets
-- ---------------------------------------------------------------------------
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null references public.categories(id),
  brand text,
  model text,
  serial_number text,
  purchase_date date,
  purchase_price numeric(12,2),
  registration_number text,
  cover_photo_url text,
  notes text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assets_user_id_idx on public.assets(user_id);
create index if not exists assets_category_idx on public.assets(category);

alter table public.assets enable row level security;
create policy "assets_owner_all" on public.assets for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Asset photos
-- ---------------------------------------------------------------------------
create table if not exists public.asset_photos (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists asset_photos_asset_id_idx on public.asset_photos(asset_id);

alter table public.asset_photos enable row level security;
create policy "asset_photos_owner_all" on public.asset_photos for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Documents (scanned invoices, warranty cards, labels, insurance, RC, etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in (
    'invoice', 'warranty_card', 'product_label', 'insurance',
    'vehicle_doc', 'service_receipt', 'purchase_receipt', 'other'
  )),
  title text not null,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  issued_date date,
  expiry_date date,
  extracted_fields jsonb,
  created_at timestamptz not null default now(),
  constraint documents_file_size_limit check (file_size_bytes <= 26214400) -- 25MB
);

create index if not exists documents_asset_id_idx on public.documents(asset_id);
create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists documents_expiry_idx on public.documents(expiry_date);

alter table public.documents enable row level security;
create policy "documents_owner_all" on public.documents for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Warranties
-- ---------------------------------------------------------------------------
create table if not exists public.warranties (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text,
  coverage_summary text,
  start_date date,
  expiry_date date not null,
  document_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists warranties_asset_id_idx on public.warranties(asset_id);
create index if not exists warranties_expiry_idx on public.warranties(expiry_date);

alter table public.warranties enable row level security;
create policy "warranties_owner_all" on public.warranties for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Maintenance records (completed service history)
-- ---------------------------------------------------------------------------
create table if not exists public.maintenance_records (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  performed_at date not null,
  odometer_km numeric(10,1),
  cost numeric(12,2),
  currency text not null default 'INR',
  service_provider text,
  notes text,
  invoice_reference text,
  document_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists maintenance_records_asset_id_idx on public.maintenance_records(asset_id);
create index if not exists maintenance_records_performed_at_idx on public.maintenance_records(performed_at desc);

alter table public.maintenance_records enable row level security;
create policy "maintenance_records_owner_all" on public.maintenance_records for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Maintenance tasks (upcoming / scheduled reminders tied to an asset)
-- ---------------------------------------------------------------------------
create table if not exists public.maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  due_date date,
  due_odometer_km numeric(10,1),
  interval_days int,
  interval_km numeric(10,1),
  status text not null default 'upcoming' check (status in ('upcoming', 'due_soon', 'overdue', 'completed')),
  estimated_cost_low numeric(12,2),
  estimated_cost_high numeric(12,2),
  effort_level text check (effort_level in ('low', 'medium', 'high')),
  steps jsonb,
  last_completed_at date,
  created_at timestamptz not null default now()
);

create index if not exists maintenance_tasks_asset_id_idx on public.maintenance_tasks(asset_id);
create index if not exists maintenance_tasks_due_date_idx on public.maintenance_tasks(due_date);
create index if not exists maintenance_tasks_status_idx on public.maintenance_tasks(status);

alter table public.maintenance_tasks enable row level security;
create policy "maintenance_tasks_owner_all" on public.maintenance_tasks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Expenses (spend breakdown line items, optionally linked to a maintenance record)
-- ---------------------------------------------------------------------------
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('parts', 'consumables', 'labor_tax', 'other')),
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  incurred_at date not null,
  maintenance_record_id uuid references public.maintenance_records(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists expenses_asset_id_idx on public.expenses(asset_id);

alter table public.expenses enable row level security;
create policy "expenses_owner_all" on public.expenses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Service providers (user's address book of mechanics / repair shops)
-- ---------------------------------------------------------------------------
create table if not exists public.service_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.service_providers enable row level security;
create policy "service_providers_owner_all" on public.service_providers for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Notifications (scheduled + delivered reminders)
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null check (type in ('maintenance', 'warranty', 'insurance', 'document', 'custom')),
  related_asset_id uuid references public.assets(id) on delete cascade,
  related_task_id uuid references public.maintenance_tasks(id) on delete cascade,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_scheduled_for_idx on public.notifications(scheduled_for);

alter table public.notifications enable row level security;
create policy "notifications_owner_all" on public.notifications for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Subscriptions (plan/entitlement state; written server-side by billing webhook)
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'plus', 'pro')),
  status text not null default 'active' check (status in ('active', 'trialing', 'canceled', 'past_due')),
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
-- Inserts/updates to subscriptions happen via a service-role billing webhook, not client writes.

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger assets_set_updated_at before update on public.assets
  for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- New-user bootstrap: create a profile + free subscription row on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  insert into public.subscriptions (user_id, plan, status) values (new.id, 'free', 'active');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
