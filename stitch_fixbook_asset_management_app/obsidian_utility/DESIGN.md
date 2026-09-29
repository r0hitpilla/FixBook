---
name: Obsidian Utility
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1.25rem
  margin-sm: 1rem
  margin-lg: 2rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system establishes an ultra-refined, precision-engineered visual environment for personal asset lifecycle and maintenance tracking. It converges the exacting restraint of modern operating systems, the rigorous spatial cadence of Material 3, and the crystalline lucidity of high-end fintech. 

The emotional objective is absolute cognitive calm. Asset maintenance is often fraught with friction, fragmented receipts, and forgotten schedules. The interface counters this entropy through:
- **Atmospheric Clarity**: Extensive negative space, pristine tonal layering, and an absence of ornamental noise.
- **Instrument-Grade Precision**: Crisp typographic hierarchy, purposeful data density, and clear status instrumentation.
- **Physicality and Tactility**: Generously rounded surfaces, deep ambient drop shadows, and subtle micro-borders that simulate finely milled hardware cards.

The aesthetic philosophy is **Modern Minimalist Utility with Tactile Depth**—grounded in slate neutrals, illuminated by deep midnight blues, and punctated by laser-focused electric accents.

## Colors

The palette uses a crisp, high-contrast light mode as its primary canvas, ensuring maximum daytime legibility for log entries, mechanical specifications, and serial numbers.

### Surface System
- **Canvas Base**: `#F8FAFC` provides a soft, warm off-white foundation that eliminates eye fatigue.
- **Surface Elevation 1 (Cards & Modules)**: `#FFFFFF` pure white, creating an immediate physical lift from the canvas.
- **Surface Elevation 2 (Grouped Insets & Segmented Controls)**: `#F1F5F9` subtle recessed tone.
- **Hairline Dividers & Outlines**: `#E2E8F0` at 1px thickness, separating distinct analytical modules without introducing visual clutter.

### Ink & Neutrals
- **Primary Ink (Headlines, Critical Values)**: Deep slate-black `#0B111E` delivering decisive optical weight.
- **Secondary Ink (Subheads, Active Labels)**: Deep navy slate `#0F172A`.
- **Muted Ink (Body, Metadata, Timestamps)**: Mid-slate `#64748B`.
- **Tertiary Ink (Placeholders, Inactive Icons)**: Light-slate `#94A3B8`.

### Accents & Semantic Telemetry
- **Primary Action (Electric Blue)**: `#2563EB` (hover/tap `#1D4ED8`) for primary CTAs, active selections, and interactive glyphs.
- **Success / Good Health**: `#10B981` (tint background `#ECFDF5`) for completed service runs, healthy warranties, and verified records.
- **Attention / Due Soon**: `#F59E0B` (tint background `#FFFBEB`) for approaching maintenance schedules and expiring warranties.
- **Critical / Overdue**: `#EF4444` (tint background `#FEF2F2`) for urgent actions, recalls, and immediate system alerts.

## Typography

Typography is governed by strict mathematical rhythm and tabular precision. Inter is selected for its robust x-height, neutral letterforms, and optimized screen rendering across variable pixel densities.

### Rules & Application
- **Numeric Display**: When presenting costs, odometer readings, hours of operation, or serial IDs, enable tabular figures (`font-feature-settings: 'tnum' 1`) to ensure perfect vertical column alignment across comparative lists.
- **Hierarchy Scale**:
  - `display-lg` and `headline-xl` are reserved exclusively for aggregate overview metrics (e.g., Total Asset Value, Active Work Orders) and screen landing titles.
  - `headline-sm` acts as the primary anchor for asset card headers and module groupings.
  - `label-sm` is formatted in uppercase with wide tracking (`0.04em`) when identifying structural section super-headers and telemetry badges.
- **Readability**: Body copy never drops below 13px on mobile viewports. High informational contrast is preserved by strictly binding text color to hierarchy levels.

## Layout & Spacing

The layout is built upon an 8-point base spatial system (with a secondary 4-point micro-scale for precise alignment within badges, chips, and micro-icons).

### Mobile Canvas Layout
- **Safe Gutters & Margins**: Default mobile outer margin is 20px (`1.25rem`). This provides ample breathing room away from display bezels while maximizing card real estate.
- **Card Padding**: Primary content containers employ `space-lg` (24px) for prominent hero modules, and `space-md` (16px) for compact listing rows.
- **Component Stacking**: Vertical gaps between card modules conform strictly to 12px or 16px to maintain unified cohesion across infinite lists.

### Responsive Behavior
- **Mobile (up to 640px)**: Single-column vertical stream. All key asset cards, health gauges, and activity feeds span 100% of the active container width.
- **Tablet (641px - 1024px)**: 2-column balanced grid with `gutter-lg` (24px), reflowing metadata side-by-side with maintenance timelines.
- **Desktop / Companion Dashboard (1025px+)**: 12-column fixed grid (max content width 1200px, auto centered), displaying persistent left navigation, central work-order streams, and right-hand telemetry sidebars.

## Elevation & Depth

Visual hierarchy does not rely on heavy contrasting strokes or skeuomorphic bevels; instead, it uses clean **surface layering**, **tinted ambient shadows**, and **crisp 1px boundary lines**.

### Elevation Scale
- **Level 0 (Base Canvas)**: Flat `#F8FAFC`, no shadow.
- **Level 1 (Stacked Cards & Lists)**: `#FFFFFF` background with a soft, diffused ambient drop shadow:
  - `box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03);`
  - Paired with an ultra-fine border: `1px solid rgba(226, 232, 240, 0.8)`.
- **Level 2 (Hover States, Active Cards, Floating Action Bars)**:
  - `box-shadow: 0 4px 6px rgba(15, 23, 42, 0.04), 0 12px 24px rgba(15, 23, 42, 0.06);`
- **Level 3 (Modals, Contextual Action Sheets, Dropdowns)**:
  - `box-shadow: 0 8px 16px rgba(15, 23, 42, 0.06), 0 24px 48px rgba(15, 23, 42, 0.12);`
  - Backdrop blur overlay: `backdrop-filter: blur(8px); background-color: rgba(15, 23, 42, 0.35);`.

The slight navy tint (`#0F172A`) inside the shadow values guarantees harmony with the slate background, eliminating muddy gray artifacts.

## Shapes

The design system favors generous, ergonomically friendly curves reflecting contemporary hardware design standards (e.g., iPhone display contours).

### Curvature Hierarchy
- **Standard Cards & Surfaces (`rounded-2xl`)**: 16px (`1rem`). Applied to main asset modules, telemetry panels, and sheet containers.
- **Hero Containers & Bottom Sheets (`rounded-3xl`)**: 24px (`1.5rem`). Applied to expanded detail sheets, modal overlays, and primary hero statistics.
- **Interactive Controls (Inputs, Form Fields)**: 12px (`0.75rem`). Strikes a balance between card fluidity and structured data entry.
- **Tags, Chips, and Micro-badges**: Fully rounded pill shapes (`rounded-full`, 9999px) to distinguish interactive filters and status indicators from underlying rectangular card surfaces.

## Components

### Buttons
- **Primary Action**: Deep slate fill `#0F172A` with pure white text, height 48px, corner radius 12px. Active press scales down slightly (`scale: 0.98`) with smooth transition.
- **Accent Action**: Electric blue `#2563EB` fill, white text, reserved for critical flow completions (e.g., "Log Service", "Add Asset").
- **Secondary / Subdued**: Clean white fill `#FFFFFF`, 1px border `#E2E8F0`, slate text `#0F172A`.
- **Destructive**: Soft red tint `#FEF2F2` fill, crimson `#EF4444` text and outline.

### Status Chips & Badges
- Pill-shaped (`rounded-full`), height 24px to 28px, padding `0 12px`.
- Composed of an 8px circular status indicator dot on the left, followed by concise, uppercase `label-sm` text.
  - **Healthy**: `#ECFDF5` container, `#059669` dot and text.
  - **Due Soon**: `#FFFBEB` container, `#D97706` dot and text.
  - **Overdue**: `#FEF2F2` container, `#DC2626` dot and text.

### Asset Cards
- Encapsulated within Level 1 elevation (pure white, 16px radius, subtle slate border).
- High visual priority: Asset title (`headline-sm`), category tag, and primary status badge aligned at top.
- Data row: Monospace/tabular numerical details (mileage, operating hours, last inspection date) paired with muted micro-labels.
- Micro-interactions: 150ms ease-out transition on tap with background shifting subtly to `#F8FAFC`.

### Form Fields & Inputs
- Height 48px, background `#FFFFFF`, border `1px solid #E2E8F0`, radius 12px.
- Left-aligned descriptive icon in `#64748B`.
- Focus state: Border transitions to `#2563EB` with an ambient glow (`box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12)`).

### Lists & Activity Feeds
- Grouped in white parent containers with 16px radius.
- List items separated by indented hairlines (`#E2E8F0`), keeping icons unpunctuated.
- Right accessory slot hosts chevron indicators (`#94A3B8`), time deltas, or numeric cost figures.

### Checkboxes & Segmented Controls
- **Checkboxes**: 20px square with 6px border radius. Unchecked has 1.5px slate border (`#CBD5E1`). Checked fills with `#2563EB` with a crisp white geometric checkmark.
- **Segmented Control**: Recessed `#F1F5F9` track with an animated Level 1 white pill thumb navigating between intervals (e.g., "Overview", "Logs", "Docs").