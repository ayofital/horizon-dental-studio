# Phase 11 accessibility audit

Audited on 10 October 2026 using system Node v22.23.2. This is a practical WCAG 2.2 AA-oriented review of a fictional portfolio site, not certification or a claim of full compliance.

## Findings and fixes

| Finding | Change |
| --- | --- |
| No shared keyboard shortcut past navigation | Root-layout skip link; stable, focusable main-content target on every public page and the treatment loading state. |
| Default 404 did not provide a main-content target | Accessible not-found page with one H1 and descriptive recovery links. |
| Header, homepage and footer lacked consistent authored focus styles | Shared green/white focus treatment, plus scroll offsets for the sticky header. |
| Mobile menu had no Escape handling or desktop resize reset | Native disclosure button controls a hidden navigation panel; Escape restores trigger focus; desktop resize clears state and transfers focus to visible navigation when needed. No modal focus trap. |
| Menu could become taller than a short viewport | Bounded, scrollable mobile navigation; disclosure used through 1100px to keep navigation comfortable. |
| Several navigation and treatment links had small hit areas | Minimum 44px height for navigation, footer, secondary and treatment-card links. Existing CTA/form/FAQ targets preserved. |
| Contact server errors tried to focus a disabled field | Focus deferred until error text is rendered and fields are enabled, following BookingForm's existing pattern. |
| Contact loading status sat inside a busy form | Busy state scoped to the fieldset so the live status remains available during submission. |
| Form error summaries relied on visual highlighting | Plain-language instruction refers to fields with error messages; existing field associations and alert semantics retained. |
| Muted text fell below 4.5:1 on pale green | Muted token darkened from #66736e to #59665f; existing palette retained. |
| Smooth scrolling and homepage hover effects did not respect reduced motion | Global reduced-motion CSS disables smooth scrolling, decorative transitions/animations and button/card hover movement. |
| Footer links lacked a named navigation landmark | Named Footer navigation landmark. |

## Files changed by this phase

Created:
- src/app/not-found.tsx
- tests/accessibility.test.mjs
- docs/accessibility-audit.md

Modified:
- src/app/layout.tsx
- src/app/globals.css
- src/components/Header.tsx
- src/components/Footer.tsx
- src/components/ContactForm.tsx
- src/components/BookingForm.tsx
- src/app/page.tsx
- src/app/about/page.tsx
- src/app/treatments/page.tsx
- src/app/treatments/[slug]/page.tsx
- src/app/treatments/[slug]/loading.tsx
- src/app/pricing/page.tsx
- src/app/patient-stories/page.tsx
- src/app/faq/page.tsx
- src/app/contact/page.tsx
- src/app/book/page.tsx

Existing uncommitted changes from earlier phases were preserved. No dependency, environment, persistence, notification or API implementation changes were made during this phase.

## Review and verification

- Existing baseline: 25 passing Node tests.
- Seven focused accessibility tests cover skip targets, language, visible labels and required status, autocomplete, form ARIA/error relationships, loading/failure/success output, native FAQ semantics, pricing definition-list relationships, descriptive treatment links, contrast thresholds, and mobile-menu Escape/resize behavior.
- Full final suite: 32 tests. Lint, TypeScript and production build checked.
- Browser checks on all 12 public routes at 320, 390, 768, 1024 and 1440 CSS pixels: one H1, one main, labelled controls, image alt attributes and no horizontal document overflow.
- Additional 720px by 450px reflow checks approximate the CSS viewport of a 1440px desktop at 200% zoom. No overflow, heading-level skips or broken ARIA references found.
- Keyboard-only traversal on every public route reached all visible interactive targets without a trap. Enter, Space, Tab, Shift+Tab and Escape exercised where relevant; date input has additional native subfield stops.
- Skip link appears on keyboard focus, moves focus to main, and allows navigation to continue there.
- Mobile menu checked for expanded state, controlled-panel relationship, link-selection closure, Escape restoration and focus transfer on desktop resize.
- Native FAQ opens/closes with Space/Enter; category anchors focus the intended heading.
- Empty Contact and Booking submissions focus their first invalid field and associate each error with its control.
- Contact demo checked in-browser through pending and success. It explicitly reports that nothing was sent or saved.
- Rendered text contrast measurements, compositing solid CSS backgrounds and alpha text, found no failures on all 12 routes. Lowest measured ratio was approximately 4.71:1. This measurement does not establish contrast against arbitrary image pixels.
- PricingList retains dl/dt/dd relationships. Existing cards retain article semantics. Existing informative clinic/team alt text and Next Image sizing retained; no decorative page imagery required changes.
- All 12 production routes, sitemap, robots and Open Graph image verified. Sitemap retains 12 public URLs; unknown treatment remains HTTP 404.
- Both live local API endpoints reject invalid input with 422 without persistence or email. Existing mocked tests cover Supabase configuration/insert failures, notification skip/failure and booking success independent of email delivery.
- Existing ESLint JSX accessibility checks plus focused DOM/assertion checks used; no axe or browser framework installed.

## Limits and follow-up

- Actual 200% browser zoom could not be activated by the in-app browser's keyboard shortcut; the 720px reflow check is an approximation, not an actual zoom test.
- Browser tooling exposes no reduced-motion emulation. Reduced-motion CSS and tests were reviewed, but preference switching was not exercised at runtime.
- No NVDA, VoiceOver or other screen-reader session, physical touch-device test, forced-colors test or independent accessibility audit was performed. Those remain useful follow-up checks.
- No fresh valid booking was submitted to the live database or email provider for this frontend phase. Existing live verification is preserved and mocked backend regressions pass.
- No intentionally unresolved issue was found in the audited public flows; the verification limits above prevent a full-compliance claim.
- No secrets or .env.local changed. Nothing committed or pushed.

Design guidance consulted: [UI Skills fixing accessibility](https://www.ui-skills.com/skills/ibelick/fixing-accessibility/llms.txt), [UI Skills repository](https://github.com/ibelick/ui-skills), and installed Apple design/Emil design engineering guidance from [Emil Kowalski skills](https://github.com/emilkowalski/skills). Native Next.js accessibility documentation and existing repository patterns informed implementation.
