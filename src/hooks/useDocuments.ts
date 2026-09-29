import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { AssetDocument, DocumentKind, ExtractedFields } from '@/types/models';

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

async function withSignedUrl(doc: Omit<AssetDocument, 'url'> & { storage_path: string }): Promise<AssetDocument> {
  const { data } = await supabase.storage.from('documents').createSignedUrl(doc.storage_path, SIGNED_URL_TTL_SECONDS);
  return { ...doc, url: data?.signedUrl ?? '' };
}

export function useDocuments(assetId?: string) {
  const userId = useAuthStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['documents', assetId ?? 'all', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      let query = supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (assetId) query = query.eq('asset_id', assetId);
      const { data, error } = await query;
      if (error) throw error;
      const rows = (data ?? []) as (Omit<AssetDocument, 'url'> & { storage_path: string })[];
      return Promise.all(rows.map(withSignedUrl));
    },
  });
}

export function useDocument(documentId: string | undefined) {
  return useQuery({
    queryKey: ['document', documentId],
    enabled: Boolean(documentId),
    queryFn: async () => {
      const { data, error } = await supabase.from('documents').select('*').eq('id', documentId).single();
      if (error) throw error;
      return withSignedUrl(data as Omit<AssetDocument, 'url'> & { storage_path: string });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      await supabase.storage.from('documents').remove([storagePath]);
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useExpiringDocuments(withinDays = 60) {
  const userId = useAuthStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['documents_expiring', userId, withinDays],
    enabled: Boolean(userId),
    queryFn: async () => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + withinDays);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .not('expiry_date', 'is', null)
        .lte('expiry_date', cutoff.toISOString().slice(0, 10))
        .order('expiry_date', { ascending: true });
      if (error) throw error;
      return data as AssetDocument[];
    },
  });
}

export interface UploadDocumentInput {
  assetId: string | null;
  kind: DocumentKind;
  title: string;
  localUri: string;
  mimeType: string;
  fileSizeBytes: number;
  issuedDate?: string | null;
  expiryDate?: string | null;
  extractedFields?: ExtractedFields | Record<string, unknown> | null;
}

const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']);

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.session?.user.id);
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (input: UploadDocumentInput) => {
      if (!userId) throw new Error('Not authenticated');
      if (!ALLOWED_MIME_TYPES.has(input.mimeType)) {
        throw new Error(`Unsupported file type: ${input.mimeType}`);
      }
      if (input.fileSizeBytes > MAX_DOCUMENT_BYTES) {
        throw new Error('File is larger than the 25MB limit.');
      }

      const extension = input.mimeType === 'application/pdf' ? 'pdf' : input.mimeType.split('/')[1] ?? 'jpg';
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

      const response = await fetch(input.localUri);
      const blob = await response.blob();
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, blob, {
        contentType: input.mimeType,
      });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          asset_id: input.assetId,
          kind: input.kind,
          title: input.title,
          storage_path: path,
          mime_type: input.mimeType,
          file_size_bytes: input.fileSizeBytes,
          issued_date: input.issuedDate ?? null,
          expiry_date: input.expiryDate ?? null,
          extracted_fields: input.extractedFields ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as AssetDocument;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      if (data.asset_id) queryClient.invalidateQueries({ queryKey: ['documents', data.asset_id] });
    },
  });
}
