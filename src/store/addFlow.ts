import { create } from 'zustand';
import type { ExtractedFields } from '@/types/models';

export type ScanDocKind = 'invoice' | 'warranty_card' | 'product_label' | 'vehicle_doc';

interface AddFlowState {
  photoUri: string | null;
  mimeType: string | null;
  docKind: ScanDocKind;
  extracted: ExtractedFields | null;
  setCapture: (photoUri: string, mimeType: string) => void;
  setDocKind: (kind: ScanDocKind) => void;
  setExtracted: (fields: ExtractedFields | null) => void;
  reset: () => void;
}

export const useAddFlowStore = create<AddFlowState>((set) => ({
  photoUri: null,
  mimeType: null,
  docKind: 'invoice',
  extracted: null,
  setCapture: (photoUri, mimeType) => set({ photoUri, mimeType }),
  setDocKind: (docKind) => set({ docKind }),
  setExtracted: (extracted) => set({ extracted }),
  reset: () => set({ photoUri: null, mimeType: null, extracted: null, docKind: 'invoice' }),
}));
