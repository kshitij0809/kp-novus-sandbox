# kp-novus-sandbox — Cursor Build Prompt

You are scaffolding a brand-new SaaS task-tracker web app whose **sole purpose is to be scanned by Novus** (Pendo's product-analytics agent). Novus walks the repo to detect Pages, Features, Track Events, Metadata, Funnels, Journeys, Agents, Segments, Goals, Flags, Guides, Session Replay config, and to build a Product Wiki. **Every screen of Novus must light up.** Build the app so each detector has clear, idiomatic code to find.

The app is a lightweight Asana/Linear-style team task tracker called **TaskPilot**. It does not need a real backend — mock data + localStorage is fine. It MUST run (`yarn dev` or `pnpm dev`), every route must render, every button/link must work, and every track event must fire.

Operate top-to-bottom. Don't ask questions; make sensible decisions and proceed. Run `yarn dev` at the end and verify the homepage renders.

---

## 1. Tech Stack (pin these exact versions/choices)

- **Next.js 15** with App Router, **TypeScript strict**, `src/` directory **disabled** (use root-level `app/`)
- **Tailwind CSS v4** + **shadcn/ui** (initialize with `npx shadcn@latest init`, default theme)
- **Zustand** for state
- **lucide-react** for icons
- **react-hook-form** + **zod** for forms
- **date-fns** for dates
- **recharts** for the Reports page
- **@pendo/agent** Web SDK (load via the standard snippet — see §6)
- Package manager: **yarn** (use `yarn` not `npm`)

Linting: ESLint default Next config, Prettier with 2 spaces / 100 width / double quotes / trailing commas.

---

## 2. Initial Setup

```bash
yarn create next-app@latest . \
  --typescript --tailwind --app --no-src-dir \
  --import-alias "@/*" --eslint --use-yarn

npx shadcn@latest init -d
npx shadcn@latest add button card input label textarea select dialog dropdown-menu \
  avatar badge tabs sheet separator switch checkbox calendar popover toast \
  table tooltip progress skeleton alert breadcrumb command form sonner

yarn add zustand date-fns recharts react-hook-form zod @hookform/resolvers lucide-react
```

After install, replace this `CURSOR_PROMPT.md` with a `README.md` at the very end (keep the prompt as `docs/CURSOR_PROMPT.md` for future reference).

---

## 3. Project Structure

```
kp-novus-sandbox/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   └── page.tsx                       # /
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── sign-in/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (onboarding)/
│   │   ├── layout.tsx
│   │   └── onboarding/
│   │       ├── welcome/page.tsx
│   │       ├── profile/page.tsx
│   │       ├── team/page.tsx
│   │       ├── plan/page.tsx
│   │       └── invite/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx                     # auth-gated app shell, sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── inbox/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx                   # list
│   │   │   ├── new/page.tsx
│   │   │   └── [projectId]/
│   │   │       ├── page.tsx               # kanban (default)
│   │   │       ├── list/page.tsx
│   │   │       ├── calendar/page.tsx
│   │   │       ├── gantt/page.tsx         # behind feature flag
│   │   │       └── tasks/[taskId]/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── team/page.tsx
│   │   ├── settings/
│   │   │   ├── layout.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── account/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   └── integrations/page.tsx
│   │   ├── upgrade/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   │   ├── help/page.tsx                  # AI assistant page
│   │   └── admin/page.tsx
│   ├── api/
│   │   └── agent/chat/route.ts            # mocked LLM endpoint (Agent surface)
│   ├── layout.tsx                         # root — Pendo SDK loads here
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── ui/                                # shadcn components
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── side-nav.tsx
│   │   ├── top-bar.tsx
│   │   └── notifications-bell.tsx
│   ├── auth/
│   │   ├── signup-form.tsx
│   │   ├── signin-form.tsx
│   │   └── forgot-password-form.tsx
│   ├── onboarding/
│   │   ├── onboarding-step-shell.tsx
│   │   ├── profile-step.tsx
│   │   ├── team-step.tsx
│   │   ├── plan-step.tsx
│   │   └── invite-step.tsx
│   ├── projects/
│   │   ├── project-list.tsx
│   │   ├── project-card.tsx
│   │   ├── create-project-button.tsx
│   │   ├── create-project-dialog.tsx
│   │   ├── project-header.tsx
│   │   ├── project-view-switcher.tsx
│   │   ├── project-filter-drawer.tsx
│   │   └── archive-project-button.tsx
│   ├── tasks/
│   │   ├── kanban-board.tsx
│   │   ├── task-list-view.tsx
│   │   ├── task-calendar-view.tsx
│   │   ├── task-gantt-view.tsx
│   │   ├── task-card.tsx
│   │   ├── new-task-button.tsx
│   │   ├── new-task-dialog.tsx
│   │   ├── task-detail-panel.tsx
│   │   ├── task-assign-dropdown.tsx
│   │   ├── task-status-badge.tsx
│   │   ├── task-priority-flag-toggle.tsx
│   │   ├── due-date-picker.tsx
│   │   ├── label-manager.tsx
│   │   ├── comment-box.tsx
│   │   ├── file-upload-button.tsx
│   │   ├── bulk-actions-bar.tsx
│   │   └── delete-task-button.tsx
│   ├── inbox/
│   │   └── inbox-list.tsx
│   ├── search/
│   │   ├── search-bar.tsx
│   │   └── command-palette.tsx
│   ├── reports/
│   │   ├── completion-rate-chart.tsx
│   │   ├── velocity-chart.tsx
│   │   ├── overdue-card.tsx
│   │   └── report-export-button.tsx
│   ├── team/
│   │   ├── team-members-table.tsx
│   │   ├── invite-team-member-modal.tsx
│   │   └── role-dropdown.tsx
│   ├── settings/
│   │   ├── notification-settings-form.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── integration-card.tsx
│   │   └── billing-payment-method-selector.tsx
│   ├── upgrade/
│   │   ├── plan-comparison-table.tsx
│   │   └── checkout-form.tsx
│   ├── help/
│   │   └── ai-assistant-chat-panel.tsx
│   ├── shared/
│   │   ├── share-link-button.tsx
│   │   ├── export-button.tsx
│   │   ├── keyboard-shortcuts-modal.tsx
│   │   ├── onboarding-checklist-widget.tsx
│   │   └── feature-announcement-banner.tsx
│   └── pendo/
│       ├── pendo-script.tsx               # injects SDK in <head>
│       └── pendo-identify.tsx             # calls pendo.initialize() on auth
├── lib/
│   ├── pendo.ts                           # track() helper, types for events
│   ├── flags.ts                           # feature flags catalogue + reader
│   ├── segments.ts                        # static segment definitions
│   ├── goals.ts                           # business goals
│   ├── guides.ts                          # in-app guide definitions
│   ├── seed.ts                            # seed data (users, projects, tasks)
│   ├── mock-api.ts                        # localStorage-backed CRUD
│   └── utils.ts
├── store/
│   ├── auth-store.ts
│   ├── projects-store.ts
│   ├── tasks-store.ts
│   ├── ui-store.ts
│   └── notifications-store.ts
├── types/
│   └── index.ts
├── public/
└── docs/
    ├── CURSOR_PROMPT.md                   # this file, archived
    ├── novus-detection-map.md             # which files map to which Novus screen
    └── pendo-events.md                    # full track-event catalogue
```

---

## 4. Domain Model (`types/index.ts`)

```ts
export type Plan = "free" | "pro" | "enterprise";
export type Role = "admin" | "manager" | "member";
export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  plan: Plan;
  signupDate: string;          // ISO
  lastLogin: string;           // ISO
  theme: "light" | "dark" | "system";
}

export interface Account {
  id: string;
  companyName: string;
  industry: string;
  teamSize: number;
  plan: Plan;
  mrr: number;
  signupSource: "organic" | "paid" | "referral" | "partner";
  trialEndDate: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  createdAt: string;
  ownerId: string;
  memberIds: string[];
  labelIds: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  dueDate: string | null;
  labels: string[];
  comments: Array<{ id: string; userId: string; body: string; at: string }>;
  attachments: string[];
  createdAt: string;
  completedAt: string | null;
}
```

---

## 5. Mock Backend

`lib/mock-api.ts` — localStorage-backed. On first load, seed from `lib/seed.ts` (1 account, 5 users incl. the current one, 6 projects, ~40 tasks across statuses, 8 comments, 3 labels, a few overdue tasks). Provide async `getProjects()`, `getProject(id)`, `createProject()`, `updateTask()`, etc. All Zustand stores delegate to this.

The current user signs in by entering any email — we mock auth completely. After "sign-in", set `auth-store.authenticated = true` and seed with a deterministic mock user.

---

## 6. Pendo SDK — CRITICAL

This is the single most important part of the build. **Without correct Pendo instrumentation, half the Novus detectors will fail.** Use the canonical snippet exactly.

### `components/pendo/pendo-script.tsx`

Server component. Inject the install snippet inline in `<head>`. Use `next/script` with `strategy="afterInteractive"` is OK but the standard Pendo snippet must appear verbatim in the document so Novus's setup-detection regexes match. Use `process.env.NEXT_PUBLIC_PENDO_API_KEY` — fall back to `"YOUR_PENDO_API_KEY_HERE"` placeholder if unset.

```tsx
import Script from "next/script";

export function PendoScript() {
  const apiKey = process.env.NEXT_PUBLIC_PENDO_API_KEY ?? "YOUR_PENDO_API_KEY_HERE";
  return (
    <Script id="pendo-snippet" strategy="afterInteractive">
      {`(function(apiKey){
          (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
          v=['initialize','identify','updateOptions','pageLoad','track'];
          for(w=0,x=v.length;w<x;++w)(function(m){
            o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};
          })(v[w]);
          y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
          z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);
        })(window,document,'script','pendo');`}
      {`window.pendo && window.pendo._q && window.pendo._q.push(['_init','${apiKey}']);`}
    </Script>
  );
}
```

Place `<PendoScript />` in `app/layout.tsx` inside `<head>`.

### `components/pendo/pendo-identify.tsx`

Client component. After auth becomes truthy, call `window.pendo.initialize({ visitor, account })` with full visitor + account payloads. Re-call `window.pendo.updateOptions({ visitor })` when the user updates their profile.

```tsx
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

declare global {
  interface Window { pendo?: any; }
}

export function PendoIdentify() {
  const { user, account, authenticated } = useAuthStore();
  useEffect(() => {
    if (!authenticated || !user || !account || typeof window === "undefined") return;
    const p = window.pendo;
    if (!p) return;
    p.initialize({
      visitor: {
        id: user.id,
        email: user.email,
        full_name: `${user.firstName} ${user.lastName}`,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        plan: user.plan,
        signup_date: user.signupDate,
        last_login: user.lastLogin,
        theme: user.theme,
      },
      account: {
        id: account.id,
        name: account.companyName,
        industry: account.industry,
        team_size: account.teamSize,
        plan: account.plan,
        mrr: account.mrr,
        signup_source: account.signupSource,
        trial_end_date: account.trialEndDate,
      },
    });
  }, [authenticated, user, account]);
  return null;
}
```

Mount `<PendoIdentify />` inside `app/(app)/layout.tsx`.

### `lib/pendo.ts` — typed `track()` helper

```ts
export type PendoEventName =
  // Auth & Signup
  | "signup_page_viewed" | "signup_email_entered" | "signup_password_entered" | "signup_completed"
  | "signin_attempted" | "signin_succeeded" | "signin_failed" | "password_reset_requested"
  // Onboarding
  | "onboarding_started" | "onboarding_step_viewed" | "onboarding_step_completed"
  | "onboarding_skipped" | "onboarding_completed"
  // Projects
  | "project_created" | "project_renamed" | "project_archived" | "project_deleted" | "project_shared"
  // Tasks
  | "task_created" | "task_completed" | "task_reopened" | "task_assigned" | "task_unassigned"
  | "task_priority_changed" | "task_due_date_set" | "task_label_added" | "task_commented"
  | "task_attachment_uploaded" | "task_deleted"
  // Views
  | "view_changed_to_kanban" | "view_changed_to_list" | "view_changed_to_calendar" | "view_changed_to_gantt"
  // Filters & search
  | "filter_applied" | "filter_cleared" | "search_performed" | "sort_changed"
  // Bulk
  | "bulk_select_started" | "bulk_action_performed"
  // Team
  | "team_member_invited" | "team_member_role_changed" | "team_member_removed"
  // Billing
  | "pricing_page_viewed" | "plan_selected" | "checkout_started" | "payment_method_added"
  | "checkout_completed" | "payment_failed" | "subscription_cancelled" | "subscription_resumed"
  // Settings
  | "notification_setting_changed" | "theme_changed" | "integration_connected" | "integration_disconnected"
  // Agent
  | "ai_assistant_opened" | "ai_assistant_query_sent" | "ai_assistant_response_received" | "ai_assistant_feedback_given"
  // Reports
  | "report_viewed" | "report_filter_changed" | "report_exported"
  // Notifications
  | "notification_clicked" | "notifications_opened" | "notifications_marked_all_read"
  // Flags
  | "feature_flag_evaluated";

export function track(event: PendoEventName, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const p = (window as any).pendo;
  if (p && typeof p.track === "function") p.track(event, properties);
  if (process.env.NODE_ENV !== "production") console.debug("[pendo.track]", event, properties);
}
```

**Use `track()` densely.** Every button, form submit, view change, modal open, plan selection, integration toggle — call `track()`. Aim for at least 50 distinct call sites across the app.

---

## 7. Funnels (model these as ordered track-event sequences in `docs/pendo-events.md`)

1. **Signup funnel**: `signup_page_viewed` → `signup_email_entered` → `signup_password_entered` → `signup_completed`
2. **Onboarding funnel**: `onboarding_started` → `onboarding_step_completed` (×4) → `onboarding_completed`
3. **Project creation funnel**: `project_create_dialog_opened` → `project_created`
4. **Task creation funnel**: `task_create_dialog_opened` → `task_created`
5. **Checkout funnel**: `pricing_page_viewed` → `plan_selected` → `checkout_started` → `payment_method_added` → `checkout_completed`
6. **Activation funnel** (cross-event): `signup_completed` → `onboarding_completed` → `project_created` → `task_created` → `task_completed`

---

## 8. Journeys

Document these in `docs/pendo-events.md` as page-level cross-flows:

- **Acquisition journey**: `/` → `/sign-up` → `/onboarding/*` → `/dashboard`
- **Power-user journey**: `/dashboard` → `/projects` → `/projects/[id]` → `/projects/[id]/tasks/[taskId]`
- **Upgrade journey**: `/dashboard` → `/upgrade` → `/checkout` → `/checkout/success` → `/settings/billing`
- **Reporting journey**: `/dashboard` → `/reports` → export
- **Help-seeking journey**: any page → `/help` → AI assistant chat

---

## 9. Goals (`lib/goals.ts`)

```ts
export const GOALS = [
  { id: "g_activation", name: "70% of new signups complete onboarding", metric: "onboarding_completed / signup_completed", target: 0.7, referenceFunnel: "onboarding" },
  { id: "g_project_setup", name: "85% of accounts create a project in first 24h", metric: "first_project_within_24h_rate", target: 0.85 },
  { id: "g_first_task", name: "60% of activated users complete a task in first week", metric: "first_task_completion_rate", target: 0.6 },
  { id: "g_mrr", name: "Reach $50k MRR", metric: "account.mrr_sum", target: 50000 },
  { id: "g_checkout", name: "Reduce checkout drop-off below 30%", metric: "checkout_dropoff_rate", target: 0.3, direction: "decrease" },
  { id: "g_retention", name: "30-day weekly retention above 40%", metric: "wk_retention", target: 0.4 },
] as const;
```

Render these on `/reports` as a "Goals" panel with mock progress bars.

---

## 10. Feature Flags (`lib/flags.ts`)

```ts
export const FLAGS = {
  gantt_view_enabled: { default: false, description: "Enables Gantt view on project detail" },
  ai_assistant_v2: { default: true, description: "New AI assistant chat panel" },
  bulk_actions_v2: { default: false, description: "Bulk actions toolbar v2" },
  new_onboarding_flow: { default: true, description: "5-step onboarding flow" },
  promo_banner_q4: { default: false, description: "Q4 upgrade promo banner" },
} as const;

export function useFlag(name: keyof typeof FLAGS): boolean {
  // read from localStorage override → fall back to default
  // fire `feature_flag_evaluated` track event with { flag: name, value }
}
```

The Gantt view route should redirect to the kanban view if `gantt_view_enabled` is false.

---

## 11. Segments (`lib/segments.ts`)

Static definitions that the Novus segment detector can pick up:

```ts
export const SEGMENTS = [
  { id: "trial_expiring", name: "Trial users about to expire", criteria: "account.plan == 'free' && account.trialEndDate within 7 days" },
  { id: "power_users", name: "Power users (10+ active projects)", criteria: "account.activeProjects >= 10" },
  { id: "free_team", name: "Free tier with 1+ team members", criteria: "account.plan == 'free' && account.teamSize > 1" },
  { id: "enterprise_admins", name: "Enterprise admins", criteria: "user.role == 'admin' && account.plan == 'enterprise'" },
  { id: "low_activity", name: "Low activity (no task created in 7d)", criteria: "no task_created in last 7 days" },
] as const;
```

---

## 12. Guides (`lib/guides.ts`)

Define in-app guides as data; render simple Sonner toast / Sheet placeholders that show them when triggered. Each is a clear "Guide" surface for Novus.

```ts
export const GUIDES = [
  { id: "welcome_dashboard", trigger: "first dashboard visit", type: "tooltip" },
  { id: "kanban_intro", trigger: "first kanban view", type: "walkthrough" },
  { id: "nps_14d", trigger: "14 days after signup", type: "poll", question: "How likely are you to recommend TaskPilot?" },
  { id: "ai_assistant_announce", trigger: "announce ai_assistant_v2", type: "banner" },
  { id: "reports_walkthrough", trigger: "first reports visit", type: "walkthrough" },
  { id: "upgrade_promo", trigger: "free user, 7d active", type: "banner" },
] as const;
```

The dashboard should show a `<OnboardingChecklistWidget />` referencing these guides.

---

## 13. Agents (`/api/agent/chat` and `<AIAssistantChatPanel />`)

The `/help` page hosts `<AIAssistantChatPanel />` — a chat UI that POSTs to `/api/agent/chat`. The route handler does NOT need a real LLM; mock the response after a 600ms delay. The handler MUST be named clearly and have a JSDoc comment so Novus's agent-detection picks it up:

```ts
// app/api/agent/chat/route.ts
/**
 * AI assistant agent endpoint. Receives a chat history and returns
 * a streamed assistant message. Mock implementation for the sandbox.
 */
export async function POST(req: Request) {
  const { messages } = await req.json();
  // ... return mock NDJSON streamed response
}
```

Fire `ai_assistant_opened`, `ai_assistant_query_sent`, `ai_assistant_response_received`, `ai_assistant_feedback_given` events.

---

## 14. Session Replay Configuration

Add a `pendo-session-replay.config.ts` at repo root with explicit masking rules so Novus's session-replay analyzer has something to find:

```ts
export const sessionReplayConfig = {
  enabled: true,
  maskInputFields: ["password", "credit_card", "cvv", "ssn"],
  maskSelectors: [
    "[data-pendo-mask='true']",
    "input[type='password']",
    ".billing-payment-method-selector input",
  ],
  blockSelectors: [".user-pii"],
  excludePages: ["/settings/billing/payment-methods/edit"],
  sampleRate: 1.0,
};
```

Apply `data-pendo-mask="true"` on the credit-card form fields in `<CheckoutForm />` and `<BillingPaymentMethodSelector />`. Apply `className="user-pii"` on profile email/phone displays.

---

## 15. Code Conventions for Novus Detection

- **Page titles**: every page must call `document.title = "TaskPilot — <PageName>"` (or use Next metadata API). Novus uses this for Page artifact names.
- **Route naming**: keep route segments lowercase-kebab — they become Page artifact slugs.
- **Component naming**: every interactive UI element gets a dedicated, semantically-named component file (see structure §3). Novus identifies Features by component-name patterns. Use `*Button`, `*Modal`, `*Dropdown`, `*Toggle`, `*Bar`, `*Form`, `*Panel`, `*Picker`, `*Selector`.
- **Track-event call sites**: place `track("event_name", { ...props })` calls inside the actual handler, not inside helper indirection. Novus pattern-matches on `pendo.track(` and `track(` literal.
- **Metadata properties**: use snake_case keys in `pendo.initialize` (already shown). Novus extracts metadata schema from the literal object passed.
- **Comment Pendo blocks**: add a `// PENDO: <description>` comment above each `track()` call site. Helps Novus's wiki generator label them.

---

## 16. Per-Page Build Notes

Hit every page; details below.

### `/` (marketing)
Hero + 3-feature grid + pricing snippet + CTA. Buttons: `<GetStartedButton />`, `<ViewPricingButton />`. Track: `landing_cta_clicked`.

### `/sign-up`
`<SignupForm />` with email + password + name. Fire events progressively (`signup_email_entered` on blur, etc). On submit → mock auth → push to `/onboarding/welcome`.

### `/sign-in`
`<SigninForm />`. On submit fire `signin_attempted`, `signin_succeeded`, push to `/dashboard`.

### `/onboarding/*`
5 linear steps: welcome, profile (firstName, lastName, role), team (companyName, teamSize, industry), plan (pick free/pro/enterprise), invite (skip-able email list). Each step fires `onboarding_step_viewed` on mount and `onboarding_step_completed` on continue. Last step fires `onboarding_completed` then redirects to `/dashboard`.

### `/dashboard`
Top: greeting card + `<OnboardingChecklistWidget />` (visible if onboarding-checklist-not-dismissed). Middle: 4 stat cards (open tasks, completed this week, overdue, active projects). Right rail: recent activity. Bottom: pinned projects.

### `/inbox`
List of tasks assigned to current user across projects. Filter dropdown.

### `/projects`
Grid of `<ProjectCard />`s. `<CreateProjectButton />` opens `<CreateProjectDialog />`. Fire `project_create_dialog_opened`, `project_created`.

### `/projects/new`
Standalone create page (alternative to dialog).

### `/projects/[projectId]`
Default to kanban (`<KanbanBoard />`). Header has `<ProjectViewSwitcher />` (kanban / list / calendar / gantt). Switcher routes to `/projects/[id]/list`, `.../calendar`, `.../gantt`. View switch fires `view_changed_to_*`.

`<NewTaskButton />` opens `<NewTaskDialog />`. Drag a card across columns to change status (any drag library, or simulate with buttons if drag is hard) — fire `task_completed` when dropped on Done.

`<KanbanBoard />` columns: Todo, In Progress, In Review, Done. Each card is `<TaskCard />` with priority flag, assignee avatar, due date, label chips. Click card → opens `<TaskDetailPanel />` (Sheet) or routes to `/projects/[id]/tasks/[taskId]`.

### `/projects/[projectId]/tasks/[taskId]`
Detail page with title, description (rich-text-ish via Textarea), `<TaskAssignDropdown />`, `<TaskStatusBadge />`, `<TaskPriorityFlagToggle />`, `<DueDatePicker />`, `<LabelManager />`, `<CommentBox />` (list + add), `<FileUploadButton />` (mock), `<DeleteTaskButton />`.

### `/projects/[projectId]/gantt`
If `useFlag('gantt_view_enabled')` is false, show "Coming soon" + redirect link. If true, show `<TaskGanttView />` (recharts horizontal bars).

### `/calendar`
Global calendar across all projects, month view via shadcn Calendar.

### `/reports`
Recharts: completion rate over time, velocity, overdue trend. Right column: `<GoalsPanel />` listing `lib/goals.ts` with progress bars. `<ReportExportButton />` fires `report_exported`.

### `/team`
`<TeamMembersTable />` + `<InviteTeamMemberModal />`. Role change via `<RoleDropdown />` fires `team_member_role_changed`.

### `/settings/profile`, `/settings/account`, `/settings/billing`, `/settings/notifications`, `/settings/integrations`
Forms persisted to localStorage. Notifications page contains `<NotificationSettingsForm />` with toggles (email, in-app, slack); each toggle fires `notification_setting_changed`. Billing shows current plan + `<BillingPaymentMethodSelector />` (mask card fields). Integrations page has 6 cards: Slack, GitHub, Jira, Google Calendar, Zapier, Linear — each toggle fires `integration_connected`/`integration_disconnected`.

### `/upgrade`
`<PlanComparisonTable />` with Free / Pro / Enterprise. CTA on Pro/Enterprise routes to `/checkout?plan=pro`. Fires `pricing_page_viewed` on mount, `plan_selected` on click.

### `/checkout`
`<CheckoutForm />` with masked credit-card inputs (`data-pendo-mask="true"`). Submit fires `checkout_started`, `payment_method_added`, then `checkout_completed` and routes to `/checkout/success`. Add a "Simulate failure" button that fires `payment_failed`.

### `/checkout/success`
Confetti + CTA back to dashboard.

### `/help`
`<AIAssistantChatPanel />` full-screen. Fire `ai_assistant_opened` on mount.

### `/admin`
Admin-only (gate by `user.role === 'admin'`). Org settings, billing summary, user list with `<RoleDropdown />`. For non-admin users, show "You don't have permission" page.

---

## 17. Side Nav (in `app/(app)/layout.tsx`)

Sections: Workspace (Dashboard, Inbox, Calendar, Reports), Projects (list of recent + "All projects"), Team, Settings, plus `<NotificationsBell />` and `<ThemeToggle />` in the top bar. `<KeyboardShortcutsModal />` triggered by `Cmd+/`.

---

## 18. Environment & Docs

Create `.env.example`:

```
NEXT_PUBLIC_PENDO_API_KEY=YOUR_PENDO_API_KEY_HERE
```

Create `.env.local` (gitignored) — leave empty; user will fill in real key.

Create `docs/novus-detection-map.md` — a table mapping each Novus screen/detector to the file(s) that exercise it:

| Novus screen | Detector | Files / Code |
|---|---|---|
| Pages | route scan | every `app/**/page.tsx` |
| Features | component name patterns | `components/**/*-button.tsx`, `*-modal.tsx`, etc. |
| Track Events | `pendo.track(` literals | `lib/pendo.ts` + every call site |
| Metadata | `pendo.initialize` props | `components/pendo/pendo-identify.tsx` |
| Funnels | event sequences | `docs/pendo-events.md` |
| Journeys | route → route flows | this doc + analytics |
| Goals | `lib/goals.ts` | `lib/goals.ts`, `/reports` |
| Flags | `lib/flags.ts` + `useFlag()` calls | `lib/flags.ts`, `*.tsx` consumers |
| Segments | `lib/segments.ts` | `lib/segments.ts` |
| Guides | `lib/guides.ts` | `lib/guides.ts`, `<OnboardingChecklistWidget />` |
| Agents | `app/api/agent/chat/route.ts` + `<AIAssistantChatPanel />` | `app/api/agent/chat/route.ts`, `components/help/` |
| Session Replay | `pendo-session-replay.config.ts` + masked DOM | repo root + `<CheckoutForm />` |
| Pendo SDK install | snippet in `<head>` | `components/pendo/pendo-script.tsx`, `app/layout.tsx` |
| Product Wiki | overall structure + JSDoc | every page + components with JSDoc |

Create `docs/pendo-events.md` — full event catalogue with: name, where fired, properties shape, which funnel it belongs to.

---

## 19. README.md

Replace `CURSOR_PROMPT.md` at repo root (after build) with a `README.md`:

```md
# kp-novus-sandbox — TaskPilot

A SaaS task tracker built as a sandbox for Novus (Pendo product analytics agent) to detect.

## Quick start

\`\`\`bash
yarn install
cp .env.example .env.local   # add NEXT_PUBLIC_PENDO_API_KEY
yarn dev                     # http://localhost:3000
\`\`\`

## What's in here

- Auth (mock), onboarding, dashboard, projects (kanban/list/calendar/gantt), tasks, inbox, reports, team, settings, billing, upgrade flow, help (AI agent), admin.
- Full Pendo Web SDK setup with visitor + account metadata.
- 50+ track events across 6 funnels.
- Feature flags, segments, goals, guides, session-replay config.

See \`docs/novus-detection-map.md\` for the full Novus surface map.
```

---

## 20. Final Steps

1. Run `yarn lint` and fix everything.
2. Run `yarn build` and confirm clean build.
3. Run `yarn dev` — manually click through `/`, `/sign-up`, `/onboarding/*`, `/dashboard`, `/projects`, a project, a task, `/upgrade`, `/checkout`. Open the browser console — `[pendo.track]` debug lines should fire on every interaction.
4. Move this file to `docs/CURSOR_PROMPT.md`. Write `README.md` per §19.
5. Stage everything: `git add .`
6. Initial commit: `git commit -m "feat: initial scaffold of TaskPilot Novus sandbox"`

Do NOT push. The user will create the GitHub remote and push manually.

---

## Acceptance Checklist

- [ ] App builds (`yarn build`) and runs (`yarn dev`) without errors
- [ ] Every route in §3 returns 200 and renders
- [ ] Pendo snippet appears in document `<head>` on every page
- [ ] `pendo.initialize({visitor, account})` called after sign-in with all metadata fields
- [ ] At least 50 distinct `track()` call sites
- [ ] All 6 funnels' events are emitted in correct order during a smoke walkthrough
- [ ] All 5 feature flags wired, Gantt route gated by `gantt_view_enabled`
- [ ] Session-replay config file exists, `data-pendo-mask` applied on payment fields
- [ ] `/help` AI agent posts to `/api/agent/chat` and streams a mock reply
- [ ] `docs/novus-detection-map.md` and `docs/pendo-events.md` exist and are accurate
- [ ] Initial git commit made; nothing pushed

When all boxes are checked, you're done. Report a short summary of what was built.
