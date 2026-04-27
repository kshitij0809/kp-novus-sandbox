# kp-novus-sandbox — TaskPilot

A SaaS task tracker built as a sandbox for Novus (Pendo product analytics agent) to detect.

## Quick start

```bash
yarn install
cp .env.example .env.local   # add NEXT_PUBLIC_PENDO_API_KEY
yarn dev                     # http://localhost:3000
```

## What's in here

- Auth (mock), onboarding (5-step), dashboard, projects (kanban/list/calendar/gantt), tasks, inbox, reports, team, settings, billing, upgrade flow, help (AI agent), admin.
- Full Pendo Web SDK setup with visitor + account metadata.
- 50+ track events across 6 funnels.
- Feature flags, segments, goals, guides, session-replay config.

## Tech stack

- **Next.js 15** App Router + TypeScript
- **Tailwind CSS v4** + **shadcn/ui**
- **Zustand** state management
- **recharts** for reports/charts
- **react-hook-form** + **zod** for forms
- **localStorage** mock backend (no server needed)

## Project structure

```
app/          — Next.js App Router pages (marketing, auth, onboarding, app)
components/   — React components (layout, auth, projects, tasks, reports, etc.)
lib/          — pendo.ts, flags.ts, segments.ts, goals.ts, guides.ts, mock-api.ts
store/        — Zustand stores (auth, projects, tasks, ui, notifications)
types/        — TypeScript domain types
docs/         — Novus detection map, pendo events catalogue, original build prompt
```

## Pendo instrumentation

| Surface | File |
|---|---|
| SDK snippet | `components/pendo/pendo-script.tsx` (loaded in `app/layout.tsx`) |
| `pendo.initialize()` | `components/pendo/pendo-identify.tsx` |
| `track()` helper | `lib/pendo.ts` |
| Feature flags | `lib/flags.ts` + `useFlag()` |
| Session replay config | `pendo-session-replay.config.ts` |
| Masked inputs | `data-pendo-mask="true"` on payment fields |
| PII blocking | `class="user-pii"` on profile email/phone |

See `docs/novus-detection-map.md` for the full Novus surface map.

See `docs/pendo-events.md` for the full track-event catalogue.

## Environment variables

```env
NEXT_PUBLIC_PENDO_API_KEY=your_api_key_here
```
