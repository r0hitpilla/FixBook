-- Storage buckets for asset photos and documents.
-- Files are private; access goes through signed URLs generated for the
-- owning user only, enforced by the policies below (path convention:
-- `<bucket>/<user_id>/<file>` so ownership can be checked from the path).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('asset-photos', 'asset-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('documents', 'documents', false, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'])
on conflict (id) do nothing;

create policy "asset_photos_owner_select" on storage.objects for select
  using (bucket_id = 'asset-photos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "asset_photos_owner_insert" on storage.objects for insert
  with check (bucket_id = 'asset-photos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "asset_photos_owner_delete" on storage.objects for delete
  using (bucket_id = 'asset-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "documents_owner_select" on storage.objects for select
  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "documents_owner_insert" on storage.objects for insert
  with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "documents_owner_delete" on storage.objects for delete
  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
