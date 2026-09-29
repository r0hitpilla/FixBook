import { File } from 'expo-file-system';
import { supabase } from './supabase';
import type { ExtractedFields } from '@/types/models';
import type { ScanDocKind } from '@/store/addFlow';

export interface ExtractionResult {
  fields: ExtractedFields;
  confidencePercent: number;
  fieldsFound: number;
}

/**
 * Sends the captured photo to the `extract-document` Supabase Edge Function
 * (see supabase/functions/extract-document), which runs the real AI vision
 * extraction server-side so the API key never ships in the app bundle.
 *
 * Never invents data: any field the model can't actually read comes back
 * null/undefined and stays blank for the user to fill in on the review
 * screen — nothing here silently fabricates a value.
 */
export async function extractDocumentFields(
  localUri: string,
  mimeType: string,
  docKind: ScanDocKind
): Promise<ExtractionResult> {
  const base64 = await new File(localUri).base64();

  const { data, error } = await supabase.functions.invoke('extract-document', {
    body: { imageBase64: base64, mimeType, docKind },
  });

  if (error) throw error;

  const fields: ExtractedFields = data?.fields ?? {};
  const nonNullCount = Object.values(fields).filter((v) => v !== null && v !== undefined && v !== '').length;

  return {
    fields,
    confidencePercent: typeof data?.confidencePercent === 'number' ? data.confidencePercent : 0,
    fieldsFound: nonNullCount,
  };
}
