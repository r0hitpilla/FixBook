import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { supabase } from './supabase';
import type { ExtractedFields } from '@/types/models';
import type { ScanDocKind } from '@/store/addFlow';

export interface ExtractionResult {
  fields: ExtractedFields;
  confidencePercent: number;
  fieldsFound: number;
}

// Modern phone cameras produce multi-megabyte photos; base64-encoding one
// inflates it further (~33%), and uploading that over a slow/flaky mobile
// connection can get cut off mid-transfer — the edge function then receives
// a truncated body and fails to parse it as JSON. Downscaling to a width
// that's still plenty legible for OCR keeps uploads small and reliable.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.7;

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
  const rendered = await ImageManipulator.manipulate(localUri).resize({ width: MAX_DIMENSION }).renderAsync();
  const saved = await rendered.saveAsync({ compress: JPEG_QUALITY, format: SaveFormat.JPEG, base64: true });

  if (!saved.base64) {
    throw new Error('Could not prepare the photo for upload. Please try again.');
  }

  const { data, error } = await supabase.functions.invoke('extract-document', {
    body: { imageBase64: saved.base64, mimeType: 'image/jpeg', docKind },
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
