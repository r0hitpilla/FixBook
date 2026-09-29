# FixBook — Supabase setup

1. Create a project at https://supabase.com.
2. In the SQL editor, run `schema.sql` then `storage.sql` (in that order).
3. Copy the project URL and anon key into `.env` (see `.env.example` at the repo root).
4. Enable Email + password auth under Authentication → Providers (magic link/OAuth can be added later).
5. Every table has Row Level Security enabled and scoped to `auth.uid() = user_id`, so
   one signed-in user can never read, list, or write another user's assets, documents,
   maintenance records, or reminders. `subscriptions` is read-only from the client —
   writes happen from a service-role billing webhook (not included here).
6. Storage buckets `asset-photos` and `documents` are private; objects must be uploaded
   under a `<user_id>/...` path so the RLS policies in `storage.sql` can match ownership.
