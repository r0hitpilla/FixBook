// Supabase Edge Function: extract-document
//
// Receives a base64 photo of a receipt/warranty card/product label/vehicle
// document and asks Claude's vision API to read out structured fields. Runs
// server-side so ANTHROPIC_API_KEY never ships inside the mobile app bundle.
//
// Deploy with:
//   supabase functions deploy extract-document
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Contract: the model is instructed to return `null` for anything it cannot
// actually read from the image. This function does not fill in guesses —
// every field the client shows is either read from the document or blank,
// and the review screen always lets the user edit before saving.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DOC_KIND_HINT: Record<string, string> = {
  invoice: 'a purchase invoice or store receipt',
  warranty_card: 'a warranty card or extended-warranty certificate',
  product_label: 'a product label, nameplate, or serial-number sticker',
  vehicle_doc: 'a vehicle registration certificate (RC) or insurance document',
};

const EXTRACTION_SCHEMA_PROMPT = `You are reading a photographed document for an asset-tracking app called FixBook.
Return ONLY a single JSON object (no prose, no markdown fences) with exactly these keys:
{
  "product": string | null,
  "category": one of ["vehicles","home_appliances","electronics","cameras_gear","tools_equipment","other"] | null,
  "brand": string | null,
  "model": string | null,
  "serial_number": string | null,
  "purchase_date": string | null (ISO 8601 "YYYY-MM-DD"),
  "purchase_price": number | null,
  "seller": string | null,
  "warranty_months": number | null
}
Rules:
- Only fill a field if the text is actually visible and legible in the image.
- If a field is not present or you are not confident, set it to null. Never guess or invent a value.
- purchase_price must be a plain number (no currency symbols or commas).
- Respond with raw JSON only.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  try {
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const { imageBase64, mimeType, docKind } = await req.json();
    if (!imageBase64 || !mimeType) {
      return new Response(JSON.stringify({ error: 'imageBase64 and mimeType are required.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const hint = DOC_KIND_HINT[docKind] ?? 'a receipt, warranty card, product label, or vehicle document';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `This photo is ${hint}.\n\n${EXTRACTION_SCHEMA_PROMPT}` },
              { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ error: `AI provider error: ${text}` }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const result = await response.json();
    const rawText: string = result?.content?.[0]?.text ?? '{}';

    let fields: Record<string, unknown>;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      fields = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      fields = {};
    }

    const nonNullCount = Object.values(fields).filter((v) => v !== null && v !== undefined && v !== '').length;
    const confidencePercent = Math.round((nonNullCount / 8) * 100);

    return new Response(JSON.stringify({ fields, confidencePercent }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
