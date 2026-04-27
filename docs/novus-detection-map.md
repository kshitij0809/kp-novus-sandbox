# Novus Detection Map

This document maps each Novus screen / detector to the files and code that exercises it.

| Novus screen | Detector | Files / Code |
|---|---|---|
| Pages | Route scan | Every `app/**/page.tsx` — 20+ routes covering marketing, auth, onboarding, app |
| Features | Component name patterns | `components/**/*Button.tsx`, `*Dialog.tsx`, `*Dropdown.tsx`, `*Toggle.tsx`, `*Bar.tsx`, `*Form.tsx`, `*Panel.tsx`, `*Picker.tsx`, `*Selector.tsx` |
| Track Events | `pendo.track(` literals | `lib/pendo.ts` (type definitions) + 50+ call sites across all components and pages |
| Metadata | `pendo.initialize` props | `components/pendo/pendo-identify.tsx` — visitor (id, email, role, plan, signup_date, last_login, theme) + account (id, name, industry, team_size, plan, mrr, signup_source, trial_end_date) |
| Funnels | Event sequences | `docs/pendo-events.md` — 6 funnels documented |
| Journeys | Route → route flows | Acquisition, Power-user, Upgrade, Reporting, Help-seeking journeys |
| Goals | `lib/goals.ts` | `lib/goals.ts`, rendered as Goals panel on `/reports` |
| Flags | `lib/flags.ts` + `useFlag()` calls | `lib/flags.ts`, `app/(app)/projects/[projectId]/gantt/page.tsx`, `app/(app)/dashboard/page.tsx` |
| Segments | `lib/segments.ts` | `lib/segments.ts` |
| Guides | `lib/guides.ts` | `lib/guides.ts`, `components/shared/onboarding-checklist-widget.tsx`, `components/shared/feature-announcement-banner.tsx` |
| Agents | Route + chat panel | `app/api/agent/chat/route.ts`, `components/help/ai-assistant-chat-panel.tsx` |
| Session Replay | Config file + masked DOM | `pendo-session-replay.config.ts`, `data-pendo-mask="true"` on checkout/billing inputs, `class="user-pii"` on profile email displays |
| Pendo SDK install | Snippet in `<head>` | `components/pendo/pendo-script.tsx` (loaded via `app/layout.tsx`) |
| Product Wiki | JSDoc + component structure | Every page + components with JSDoc, `app/api/agent/chat/route.ts` |
