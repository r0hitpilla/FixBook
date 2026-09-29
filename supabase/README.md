# FixBook — Supabase setup

1. Create a project at https://supabase.com.
2. Apply the schema — pick one:
   - **CLI (recommended)**:
     ```
     npx supabase login
     npx supabase link --project-ref your-project-ref
     npx supabase db push
     ```
     This applies `migrations/20250101000000_initial_schema.sql` and
     `migrations/20250101000001_storage_buckets.sql` directly from disk, so there's no
     copy/paste step to go wrong.
   - **SQL editor**: paste `schema.sql`, run it, then paste `storage.sql` and run it.
     If you hit a `syntax error near ";"` partway through a long line, your clipboard/editor
     mangled the paste — copy from the raw file (not a rendered/wrapped preview) or switch
     to the CLI method above.
3. Copy the project URL and anon key into `.env` (see `.env.example` at the repo root).
4. Enable Email + password auth under Authentication → Providers (magic link/OAuth can be added later).
5. Every table has Row Level Security enabled and scoped to `auth.uid() = user_id`, so
   one signed-in user can never read, list, or write another user's assets, documents,
   maintenance records, or reminders. `subscriptions` is read-only from the client —
   writes happen from a service-role billing webhook (not included here).
6. Storage buckets `asset-photos` and `documents` are private; objects must be uploaded
   under a `<user_id>/...` path so the RLS policies in `storage.sql` can match ownership.

`schema.sql` and `storage.sql` are kept at the top level as the source of truth / for
manual reading; `migrations/` holds copies in the CLI's expected format.
