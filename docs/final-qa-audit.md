# Phase 15 — final QA

Date: 10 October 2026. System Node v22.23.2; Next.js 16.4.0. Verification used the local production build on port 3001, with a temporary development-only error-boundary probe on port 3000. The probe was removed. This is a fictional portfolio project, not a live dental practice.

## Baseline and final checks

Before fixes: Git status recorded; earlier uncommitted work preserved; lint, TypeScript, 38 tests and the production build passed. SHA-256 snapshots of 83 repository files established the phase baseline.

After the application fixes: `npm run lint`, `npx tsc --noEmit`, `node --test tests/*.test.mjs` and `npm run build` passed. Final suite: **41 passed, zero failed or skipped**. The production server started successfully. `git diff --check` passed; Git reported existing line-ending normalization warnings only.

## Defects fixed and scope

| File | Change |
| --- | --- |
| `src/app/page.tsx` | Removed unsupported 4.9/5 rating, patient-count and practice-experience claims. Replaced them with practice values and explicitly fictional team/story copy, preserving the design. |
| `src/components/Header.tsx` | Header booking CTA now closes an expanded tablet/mobile menu. Previously the menu remained open after navigation to `/book`. |
| `src/components/Button.tsx` | Forwards an optional native anchor click handler for the existing header action. Other callers retain their behavior. |
| `tests/accessibility.test.mjs` | Extended the existing navigation test through the actual Button handler to protect the booking-menu fix. |
| `tests/content.test.mjs` | Three rendered-content tests covering fictional homepage disclosure, treatment content isolation/shared prices, and shared team/consultation/story/FAQ content. |
| `README.md` | Corrected the starter instructions to the actual `src/app/page.tsx` path. Environment instructions were checked against the code. |
| `docs/final-qa-audit.md` | This verification record. |

No unrelated refactoring, dependency, styling-system, environment-secret or Git-history changes were made. Existing uncommitted work remains intact. No commit or push was performed.

## Routes, navigation and assets

All 12 public routes passed direct production HTTP and browser navigation: `/`, `/about`, `/pricing`, `/patient-stories`, `/faq`, `/contact`, `/book`, `/treatments` and all four treatment detail routes. Every public destination was also reached through site links. Header links, both logo links, all footer links, homepage hero/final booking CTAs, pricing CTA and four treatment-card links were exercised.

Four unknown-path checks returned HTTP 404, including unknown and malformed treatment slugs and a nested unknown treatment path. The custom 404 provides working recovery links and noindex metadata. Thirteen distinct local destinations found in rendered links and 25 referenced Next.js assets returned HTTP 200. Sitemap, robots and the native Open Graph image returned HTTP 200; the sitemap lists exactly 12 public routes and excludes APIs.

Mobile menu opening, toggle closing, Escape/focus restoration, selection closing and desktop-resize focus restoration passed. The corrected tablet header booking CTA was retested in the rebuilt production app and leaves the menu closed.

## Content and shared data

Homepage sections, hero/team images, treatment links, indicative prices, practice values, fictional stories, FAQ preview and CTAs were reviewed. About uses the existing team and restrained care/technology copy. Pricing displays consultation examples of £95/£95/£75 and treatment starting prices of £75/£350/£2,500/£2,900 from shared data. Disclaimers and payment guidance remain visible. Stories retain fictional disclosures, realistic outcomes and related treatment links. FAQ retains five categories, 14 native disclosures and the four-question homepage preview.

Rendered treatment assertions check each treatment's description, suitability, benefits, process, FAQs, price and booking CTA and exclude other treatments' long descriptions. Shared-data assertions check complete people, fees, stories and FAQ groups. Address and opening hours are reused from `src/data/practice.ts` in Contact and Footer. No additional contradictory prices, hours or fabricated review evidence was found during this review.

## Forms and APIs

Production browser checks confirmed Contact's explicit demo success, initial invalid-field errors, error associations and first-invalid-field focus. Nothing is sent or saved by Contact. Booking's live saved summary showed the selected treatment, date and time; reset cleared the fields and consent and returned focus to the name field. Empty booking submission showed the expected seven field errors.

Production HTTP checks rejected 15 individually invalid fields across both APIs, covering missing names, invalid email/phone, invalid choices, past/impossible booking dates, invalid time, missing consent and oversized messages. Both APIs returned 400 for malformed JSON, 422 for invalid shapes/fields, 413 for the existing body limit and 405 for GET. No public booking read route is exposed.

Existing tests execute the real submit handlers with controlled hooks and request primitives for network/abort failure, non-JSON responses, malformed JSON/success/error shapes, 500 responses, retained entries, released pending state, retry and duplicate-submit guards. Persistence and notification failures are exercised with mocked providers: failed persistence cannot return stored success; failed/skipped/scheduling-failed notification cannot overturn a successful insert. These failure cases were not induced against the live providers or injected into the production browser.

## Single live integration test

Exactly one new fictional booking was submitted through the production browser:

- Identity: `Phase 15 QA Example 20261010`.
- Marker: `PHASE-15-QA-20261010`.
- Treatment/date/time: General Dentistry, 1 January 2099, Morning.
- Supabase row: `3c88f499-74c2-4279-81c9-be451671e94d`, confirmed with a narrowly filtered read-only query.
- Resend message: `01a12692-1163-7c50-bd6c-ae742d5cf728`, matching marker confirmed through read-only API; provider event **delivered**.

The recognizable fixture remains for later deletion by the project owner. No additional valid live bookings or notification retries were sent. Resend delivery means the recipient server accepted the notification; inbox placement was not independently inspected. No patient confirmation email or real appointment was created.

## SEO, environment and security

Every public route has a unique title, description, matching canonical path, Open Graph and Twitter fields. Dynamic treatment metadata remains data-derived. Production URL validation tests pass for a supplied HTTPS origin and reject invalid/local production origins.

`NEXT_PUBLIC_SITE_URL` is currently unset, so the production build correctly uses the reserved `https://horizon-dental-studio.example` fallback. **Set the real public HTTPS origin and rebuild before publishing.** No public deployment was required or performed.

`.env.example` and README match the actual required booking settings, optional notification settings and public-origin setting. `.env.local` remains ignored and was not modified. Both actual configured Supabase privileged and Resend secret values were absent from repository files (including tests/docs) and all 25 browser assets inspected. Import-graph tests prevent client modules from reaching provider/server-only modules.

Live database inspection confirmed RLS enabled and no SELECT or INSERT privilege for either anon or authenticated roles on bookings. Provider errors and submitted values are not included in application error logs or failure responses. Server-side validation, unknown-field stripping, insert-only persistence and HTML escaping in notification templates were verified by code review and tests. No dangerous raw-HTML rendering was found. This was a security sanity check, not a penetration test.

## Accessibility, responsive and browser coverage

Chromium in-app browser: all 12 routes plus custom 404 at **320, 390, 768, 1024 and 1440px**: 65 checks, with no horizontal overflow, clipped form/link controls, missing alt attributes, broken loaded images, missing anchor targets or heading-level skips. Each view has one main h1. Full-page visual review covered all routes at 320px; desktop and intermediate-width screenshots additionally checked shared layouts, images, cards, footer, pricing and forms. Homepage tablet landscape at 1024×768 was also reviewed.

Keyboard checks verified skip-link focus, visible 3px focus outlines, menu behavior, native Enter/Space toggling for all 14 FAQs, and focusable targets for all five FAQ anchors. Form labels, hints, invalid-state associations and live announcements were checked in rendered tests and the browser. Shared text/error/focus contrast thresholds and reduced-motion CSS passed existing tests.

The temporary development boundary probe confirmed focused recovery heading, no private exception text in the visitor-facing main content and keyboard retry returning to the recovered page. Global/root recovery markup and retry/focus behavior also passed tests; a production root-layout crash was not forced.

Available browser surfaces were Chromium-based; no Firefox or WebKit engine was available. True browser 200% zoom, OS reduced-motion switching and a screen-reader smoke test were unavailable through the enabled controls. Narrow viewports are not presented as substitutes for true zoom. Reduced-motion rules were inspected/tested, rather than toggled at OS level.

## Remaining limits

- Configure the real public origin before release. Public deployment behavior has not yet been tested.
- Notification sending remains best-effort, with no durable queue or retry. Cross-request idempotency remains outside scope: a lost response or timeout can leave insert receipt uncertain, so inspect the database before repeating that booking.
- The mock-based automated tests and browser smoke checks do not establish assistive-technology or cross-engine certification. Complete the unavailable zoom, screen-reader, reduced-motion-toggle and additional-engine checks when those tools are available.
- Contact remains a deliberate non-persistent demo; the project remains fictional.

No qualifying Next.js framework feedback issue was identified in this phase. The defects were in application content/navigation and documentation.
