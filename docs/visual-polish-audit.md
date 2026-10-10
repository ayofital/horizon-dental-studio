# Phase 13 — visual polish audit

Reviewed on 10 October 2026 using system Node v22.23.2 and the existing Next.js 16 application. This is a refinement of the established cream, green and white design, with no new features or dependencies.

## Findings and changes

| Area | Finding | Refinement |
| --- | --- | --- |
| Typography | Homepage/shared headings lacked the balancing used by later pages. At 320px, “conversation.” in the final CTA split its punctuation onto another line. | Shared balanced headings and pretty paragraph wrapping; mobile final CTA heading uses a 32–40px scale with a 1.08 line height. Other heading scales and font weights remain unchanged. |
| Section rhythm | The mobile `.section` rule restored bottom padding on the final CTA section, adding another gap before the footer. | Restore zero bottom padding for that specific section at mobile widths. Keep the existing 72px mobile / 96px desktop section rhythm elsewhere. |
| Footer | Extra link gaps and padding made the footer disproportionately tall. | Reduce padding, separation above the footer and mobile column gaps; remove redundant paragraph margin. Retain every existing link, address/hours, concept disclosure and 44px link targets. Desktop footer now measures approximately 434px tall. |
| Navigation | The hamburger stayed unchanged when the menu opened. | Three CSS strokes become a close icon using the existing `aria-expanded` state. Existing Escape, focus restoration and menu logic remain unchanged. The transition is 150ms and covered by the existing reduced-motion override. |
| Cards | One-column tablet treatment/testimonial cards retained unnecessary minimum heights; the treatment price had a large gap before its heading. | Use natural minimum heights below 960px and reduce the treatment price gap from 48px to 24px. Preserve desktop grids, card padding, radii and restrained hover effects. |
| CTAs | The homepage “View pricing” button wrapped at 1024px because the flex layout squeezed it. | Prevent that button from shrinking; the existing text area remains flexible. Add shared press feedback and a subdued disabled button appearance. |
| Forms | The Contact submit button had a different mobile width from Booking. | Match its full-width mobile treatment to Booking. Preserve field heights, labels, ARIA relationships, validation, consent, date/select controls and state behavior. |
| Images | Wide tablet team cards cropped the tops of portraits. | Anchor the existing team images at the top below 960px. Keep the same assets, dimensions, `sizes`, lazy loading, alt text and desktop crops. |

## Files in this phase

- `src/app/globals.css`: shared refinements above.
- `src/app/contact/contact.css`: mobile submit button alignment.
- `docs/visual-polish-audit.md`: this review and its verification record.

The repository already contained uncommitted changes from earlier phases. Those changes were preserved; this phase did not modify backend code, components, data, SEO configuration, image configuration, dependencies or environment files.

## Verification

- Baseline and final: ESLint, `npx tsc --noEmit`, all 34 Node tests and production build pass. The build generates all 21 entries successfully.
- Visually reviewed homepage, About, Treatments, all four treatment details, Pricing, Patient Stories, FAQ, Contact, Booking and the custom 404 at 320, 390, 768, 1024 and 1440px before refinement. Rechecked changed layouts with production screenshots and DOM measurements; 1024×768 supplied the landscape tablet review.
- All 65 route/viewport combinations have one main H1, no document horizontal overflow and no form controls or CTA buttons outside the document width.
- All 12 public routes return HTTP 200. Unknown page and treatment routes return HTTP 404. `robots.txt`, `sitemap.xml` and the PNG Open Graph image return HTTP 200 with the expected content types. Public HTML retains canonical and Open Graph metadata.
- Browser: keyboard menu opening/closing, visible close icon, Escape focus restoration, native FAQ keyboard disclosure, category anchors, visible focus styling, Contact validation and demo success, and Booking invalid submission were checked.
- Existing tests verify form labels, required fields, hints, announcements, pending/failure states, focusable booking confirmation, contrast, navigation behavior and semantic FAQ/pricing relationships.
- Persistence/email regression tests verify validated inserts, safe configuration/insert failures, stored booking success, deferred practice notification, trusted email addresses and sanitization, and notification failures not overturning a saved request. Backend code and live configuration are unchanged. No fresh live database insert or email delivery was performed in this phase; the prior live integration verification remains the live evidence.
- Reduced-motion rules still disable all transitions/animations and smooth scrolling and suppress card/button hover movement. The menu needs no animation to convey state. CSS rules were inspected; the browser/OS reduced-motion preference could not be toggled through the available browser controls.
- Final diff review: no whitespace errors; no unrelated phase-13 edits. No dependencies, secrets or `.env.local` changes. No commit, push, branch change or history operation.

## Deliberately retained

The existing page compositions, colors, typography family, 1200px container, card radii, desktop card alignment, images and subtle hover effects remain. Content-heavy pages keep their distinct editorial layouts. Booking keeps its explanatory text and logical DOM/keyboard order rather than visually reordering the form. Fictional practice disclosures remain visible. No copy or statistics were added to fill space.

From a client/recruiter/developer perspective, the strongest improvements are consistent small-screen CTAs, purposeful card spacing, more compact shared navigation/footer presentation and honest, readable form states. Deployment-specific origin/domain configuration remains a separate deployment concern.

## Guidance consulted

[UI Skills](https://www.ui-skills.com/) and its [baseline UI guidance](https://github.com/ibelick/ui-skills), plus [Emil Kowalski's skills](https://github.com/emilkowalski/skills) and the installed Emil/Apple design guidance informed wrapping, restrained state feedback and readable spacing. Stack-specific examples were adapted to the repository's existing plain CSS; no Tailwind, motion package or alternative design system was introduced.
