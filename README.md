# FixBook

A personal asset & maintenance memory app — scan a receipt, warranty card, or product label and FixBook remembers what you own, when it needs care, and what you've spent on it.

Built with Expo + React Native + TypeScript + Expo Router, Supabase (Postgres, Auth, Storage, Edge Functions), and TanStack Query.

## Implementation map

| Stitch screen | App route | Key components |
|---|---|---|
| `fixbook_onboarding` | `app/onboarding.tsx` | hero carousel, feature deck |
| — (auth not in Stitch export) | `app/(auth)/login.tsx`, `signup.tsx` | `TextField`, `PrimaryButton` |
| `fixbook_home_dashboard` | `app/(tabs)/index.tsx` | `ReminderCard`, category grid, recently-added rail |
| — (assets list not in Stitch export) | `app/(tabs)/assets.tsx` | `AssetCard` |
| — (activity/profile not in Stitch export) | `app/(tabs)/activity.tsx`, `profile.tsx` | |
| `fixbook_add_anything` | `app/add/index.tsx` | `ScanButton`, upload/manual entry |
| `fixbook_ai_scanning` | `app/add/scan.tsx` | `expo-camera` live capture + processing sheet |
| `fixbook_review_ai_extraction` | `app/add/review.tsx` | editable extracted fields, `CategoryField` |
| — (manual entry) | `app/add/manual.tsx` | |
| `fixbook_asset_detail` | `app/asset/[id]/index.tsx` | hero, telemetry, countdown, `DocumentCard`, `MaintenanceCard` |
| `fixbook_maintenance_timeline` | `app/asset/[id]/timeline.tsx` | year-grouped timeline |
| — (log service form) | `app/asset/[id]/add-maintenance.tsx` | |
| `fixbook_reminder_detail` | `app/reminder/[id].tsx` | diagnostics grid, step checklist, alert config |
| — (documents not in Stitch export) | `app/documents/index.tsx`, `[id].tsx` | `DocumentCard` |
| — (search/settings/subscription not in Stitch export) | `app/search.tsx`, `app/settings/index.tsx`, `app/subscription.tsx` | |

Design tokens (colors, typography, spacing, radius, shadows) are extracted verbatim from `design/stitch-export/obsidian_utility/DESIGN.md` and each screen's embedded Tailwind config into `src/theme/`. Screens not covered by the Stitch export were built using the same tokens and components rather than a different visual style.

## Setup

1. **Supabase project**
   - Create a project at supabase.com.
   - Apply the schema with the Supabase CLI (recommended — avoids SQL-editor copy/paste
     mangling long lines):
     ```
     npx supabase login
     npx supabase link --project-ref your-project-ref
     npx supabase db push
     ```
     This runs `supabase/migrations/*.sql` (schema + storage buckets/policies) directly
     against your project. If you'd rather paste into the SQL editor, use
     `supabase/schema.sql` then `supabase/storage.sql` and paste from a plain-text
     view (e.g. the raw file), not a rendered/wrapped one — see `supabase/README.md`.
   - Deploy the AI extraction edge function (uses Google Gemini, which has a free
     tier — get a key at https://aistudio.google.com/apikey, no credit card needed):
     ```
     supabase functions deploy extract-document
     supabase secrets set GEMINI_API_KEY=AIza...
     ```
   - Enable Email/Password auth under Authentication → Providers.

2. **Environment variables**
   ```
   cp .env.example .env
   # fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **Install & run**
   ```
   npm install
   npx expo start
   ```
   Scan the QR code with Expo Go, or press `i`/`a` for a simulator/emulator.

## Notes on this build

- Verified in this environment: `npx tsc --noEmit` (clean), `npx eslint .` (clean), and `npx expo export` (full Metro bundle, ~1970 modules, builds successfully) — confirming every screen, route, and import resolves correctly.
- **Not verified here**: this sandbox has no iOS Simulator/Android emulator, so the golden-path flows (sign up → scan → review → asset detail → log maintenance → reminder) have not been exercised on-device. Run `npx expo start` locally against a real Supabase project to do that pass before shipping.
- The Stitch export's lifestyle photography (onboarding hero, demo thumbnails) is referenced by its original hosted URL rather than bundled locally — replace with your own imagery for production branding.
- `app/(tabs)` uses a custom tab bar (not Stitch-exported, but built from the same bottom-nav spec in `fixbook_home_dashboard/code.html`) to support the floating center "Add" button.
