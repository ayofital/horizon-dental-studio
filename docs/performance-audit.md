# Phase 12 performance audit

Verified on 10 October 2026 with system Node v22.23.2, Next.js 16.4.0 and a local production server. Baseline lint, TypeScript, 32 tests and production build passed before changes.

## Changes and measured evidence

| Finding | Before | After | Reason |
| --- | --- | --- | --- |
| Unused Geist Mono | Two preloaded fonts, 52,396 bytes | One Geist font, 29,288 bytes | Saves 23,108 bytes without changing visible typography |
| Mobile hero selection at 390px | 640px WebP, 26,092 bytes | 384px WebP, 13,004 bytes | More accurate sizes plus smaller mobile optimizer candidates |
| Homepage CSS | 17,148 bytes | 15,071 bytes | Font CSS reduction and modest duplicate-rule cleanup |
| Header rules | Duplicate overriding gaps and menu rules | Consolidated same final values | Preserve the established 1100px navigation breakpoint |
| Starter page stylesheet | Unimported 165-line file | Removed | Maintenance cleanup; this file was already absent from shipped CSS |

Mobile image comparison is at the browser's current device scale. Higher-density screens appropriately select larger candidates. The hero source remains 607,627 bytes at 3648x2736; Next serves optimized WebP variants. Team sources are 57–96 KB. Original images were retained to preserve quality. Fill containers retain predictable dimensions and object-fit; no layout dimensions changed. Only the homepage critical image opts into preload, using the Next 16 API. About and team images retain lazy loading. The generated Open Graph image is a separate static 1200x630 asset.

## Files changed in this phase

- `next.config.ts`: retain desktop image candidates, add 320/384 mobile candidates; keep smaller image candidates distinct to avoid duplicate 384 descriptors.
- `src/app/layout.tsx`: remove unused Geist Mono; retain self-hosted next/font Geist.
- `src/app/page.tsx`: accurate hero sizes and preload.
- `src/app/about/page.tsx`: accurate story image sizes.
- `src/components/TeamCard.tsx`: accurate shared team image sizes.
- `src/app/globals.css`: consolidate proven duplicate header/menu rules without changing computed behavior.
- `src/app/page.module.css`: remove unimported starter stylesheet.
- `tests/performance.test.mjs`: two architecture assertions for transitive client import boundaries and critical-image preload/alt/sizes policy.
- `docs/performance-audit.md`: this report.

Existing uncommitted work from earlier phases was preserved. No unrelated files, dependency manifests, secrets or `.env.local` were changed in this phase.

## Client, dependency and backend audit

Header, ContactForm and BookingForm are the only client components. Each needs interactive state. Static pages, FAQ/native details, cards and layout remain Server Components; no boundary changes were justified. Booking Zod validation is deliberate and shared. Supabase and Resend imports remain behind server-only guards; transitive client import tests pass.

Supabase initialization remains lazy and cached, validates configuration gracefully and does no build-time connection work. APIs parse a bounded body once, validate before persistence and do not cache POST responses. A successful database insert remains the source of truth. Resend notification is scheduled once with after() after persistence; missing configuration, delivery and scheduling failures cannot overturn a stored booking. No backend code changed. Regression tests cover these behaviors with mocks; no new live booking or email was sent during this phase.

## Rendering, loading, cache and network

Homepage, About, Pricing, Patient Stories, FAQ, Contact and treatment index remain naturally static. Existing generateStaticParams generates the four known treatment paths. Build output includes static and partial-prerendered treatment entries, with booking retaining a static shell and a dynamic clinic-date form region. Both POST APIs remain dynamic. No new cache layer, forced rendering mode or decorative loading screen was added. Existing treatment loading, form busy/error/success states, default Link prefetch and accessible menu behavior remain intact.

Initial unique script payload measurements (includes framework, not just application code; gzip is a local estimate, not measured transfer encoding):

| Route | Baseline raw JS / estimated gzip | After raw JS / estimated gzip |
| --- | --- | --- |
| Home | 597,062 / 185,904 bytes | 597,066 / 185,913 bytes |
| Booking | 703,583 / 215,709 bytes | 703,583 / 215,709 bytes |
| Contact | 587,508 / 182,466 bytes | 587,508 / 182,466 bytes |

No meaningful JavaScript reduction is claimed. Required validation and framework code were retained. Browser asset inventory showed one local font and optimized hero preload, local scripts/styles and ordinary Next RSC prefetch traffic. Opening the menu caused additional route prefetches, including distinct RSC variants; these are framework navigation work rather than duplicated database/email work. No observed external runtime/font or booking/contact POST requests occurred on static pages. The available inventory is not a complete HAR or transfer-timing trace.

## Checks

- Lint, TypeScript, all 34 tests and production build pass. Build generates 21 entries without warnings.
- Twelve public routes checked in production at 320, 390, 768, 1024 and 1440 pixels: one H1 each, no horizontal overflow. Hero/team geometry and lazy-loading hints inspected.
- All public routes return 200 with canonical metadata; sitemap, robots and Open Graph return 200; unknown treatment returns 404.
- Empty booking/contact POSTs return 422 before persistence. Existing API tests cover valid, malformed, oversized, persistence failure and notification failure paths.
- Mobile menu opens/closes, Escape restores button focus and its focus outline remains visible. Existing accessibility tests pass for native FAQ, labels, validation relationships, busy/success states, contrast, skip links and navigation.
- Existing six SEO assertions pass; metadata and native SEO endpoints remain intact.

## Limitations and follow-up

The available browser has no Lighthouse, Chrome trace or page Performance API access. Production DOM, asset inventory, response checks and deterministic payload sizes are the closest available audit. No Lighthouse score, LCP, CLS, INP or TBT value is claimed. Predictable image containers reduce layout-shift risk, but measured CLS was unavailable. A deployed-site trace/field audit is the useful next measurement; this local run is not a throttled or real-user benchmark. No speculative framework bundle surgery or source-image quality reduction was attempted. The existing production URL placeholder must still be configured for deployment, as recorded by the SEO phase.

No dependencies were added or upgraded. Supabase/Resend behavior was preserved, secrets were untouched, and no commit or push was made.
