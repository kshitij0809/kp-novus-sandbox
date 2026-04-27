# Pendo Track Events Catalogue

Full event catalogue with name, where fired, properties shape, and funnel membership.

## Auth & Signup

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `signup_page_viewed` | `app/(auth)/sign-up/page.tsx` | `{}` | Signup (step 1) |
| `signup_email_entered` | `components/auth/signup-form.tsx` (email onBlur) | `{}` | Signup (step 2) |
| `signup_password_entered` | `components/auth/signup-form.tsx` (password onBlur) | `{}` | Signup (step 3) |
| `signup_completed` | `components/auth/signup-form.tsx` (form submit) | `{ email, first_name }` | Signup (step 4), Activation |
| `signin_attempted` | `components/auth/signin-form.tsx` | `{ email }` | — |
| `signin_succeeded` | `components/auth/signin-form.tsx` | `{ email }` | — |
| `signin_failed` | `components/auth/signin-form.tsx` | `{ email, reason }` | — |
| `password_reset_requested` | `components/auth/forgot-password-form.tsx` | `{ email }` | — |

## Onboarding

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `onboarding_started` | `app/(onboarding)/onboarding/welcome/page.tsx` | `{}` | Onboarding (start) |
| `onboarding_step_viewed` | Each onboarding step on mount | `{ step, step_number }` | Onboarding |
| `onboarding_step_completed` | Each onboarding step on continue | `{ step, step_number }` | Onboarding |
| `onboarding_skipped` | Invite step skip button | `{ step }` | — |
| `onboarding_completed` | `app/(onboarding)/onboarding/invite/page.tsx` | `{ invites_sent }` | Onboarding (final), Activation |

## Projects

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `project_create_dialog_opened` | `components/projects/create-project-button.tsx` | `{ source? }` | Project creation (step 1) |
| `project_created` | `components/projects/create-project-dialog.tsx`, `app/(app)/projects/new/page.tsx` | `{ project_id, name, source? }` | Project creation (step 2), Activation |
| `project_renamed` | Settings | `{ project_id }` | — |
| `project_archived` | `components/projects/project-card.tsx` | `{ project_id }` | — |
| `project_deleted` | — | `{ project_id }` | — |
| `project_shared` | `components/shared/share-link-button.tsx` | `{ url }` | — |

## Tasks

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `task_create_dialog_opened` | `components/tasks/new-task-button.tsx` | `{ project_id }` | Task creation (step 1) |
| `task_created` | `components/tasks/new-task-dialog.tsx` | `{ task_id, project_id, priority }` | Task creation (step 2), Activation |
| `task_completed` | Kanban move, list checkbox, detail page status | `{ task_id, project_id }` | Activation |
| `task_reopened` | Kanban move, list checkbox, detail page status | `{ task_id }` | — |
| `task_assigned` | `components/tasks/task-assign-dropdown.tsx` | `{ user_id }` | — |
| `task_unassigned` | `components/tasks/task-assign-dropdown.tsx` | `{ previous_assignee }` | — |
| `task_priority_changed` | `components/tasks/task-priority-flag-toggle.tsx` | `{ from, to }` | — |
| `task_due_date_set` | `components/tasks/due-date-picker.tsx` | `{ date }` | — |
| `task_label_added` | `components/tasks/label-manager.tsx` | `{ label }` | — |
| `task_commented` | `components/tasks/comment-box.tsx` | `{ task_id, project_id }` | — |
| `task_attachment_uploaded` | `components/tasks/file-upload-button.tsx` | `{ task_id }` | — |
| `task_deleted` | `components/tasks/delete-task-button.tsx` | `{ task_id, project_id }` | — |

## Views

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `view_changed_to_kanban` | `components/projects/project-view-switcher.tsx` | `{ project_id }` | — |
| `view_changed_to_list` | `components/projects/project-view-switcher.tsx` | `{ project_id }` | — |
| `view_changed_to_calendar` | `components/projects/project-view-switcher.tsx` | `{ project_id }` | — |
| `view_changed_to_gantt` | `components/projects/project-view-switcher.tsx` | `{ project_id }` | — |

## Filters & Search

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `filter_applied` | `app/(app)/inbox/page.tsx` | `{ source, filter }` | — |
| `filter_cleared` | Various | `{ source }` | — |
| `search_performed` | `components/search/command-palette.tsx` | `{ result, source }` | — |
| `sort_changed` | Various | `{ sort_by, direction }` | — |

## Bulk

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `bulk_select_started` | `components/tasks/task-list-view.tsx` | `{ project_id }` | — |
| `bulk_action_performed` | `components/tasks/bulk-actions-bar.tsx` | `{ action, count, project_id }` | — |

## Team

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `team_member_invited` | `app/(app)/team/page.tsx`, onboarding invite | `{ email?, count?, source }` | — |
| `team_member_role_changed` | `app/(app)/team/page.tsx`, `app/(app)/admin/page.tsx` | `{ user_id, new_role, source? }` | — |
| `team_member_removed` | — | `{ user_id }` | — |

## Billing

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `pricing_page_viewed` | `app/(app)/upgrade/page.tsx`, billing settings | `{ source }` | Checkout (step 1) |
| `plan_selected` | `app/(app)/upgrade/page.tsx`, onboarding plan | `{ plan, source }` | Checkout (step 2) |
| `checkout_started` | `app/(app)/checkout/page.tsx` | `{ plan }` | Checkout (step 3) |
| `payment_method_added` | `app/(app)/checkout/page.tsx`, billing settings | `{ plan?, source? }` | Checkout (step 4) |
| `checkout_completed` | `app/(app)/checkout/page.tsx` | `{ plan }` | Checkout (step 5) |
| `payment_failed` | `app/(app)/checkout/page.tsx` | `{ plan, reason }` | — |
| `subscription_cancelled` | `app/(app)/settings/billing/page.tsx` | `{ plan }` | — |
| `subscription_resumed` | — | `{ plan }` | — |

## Settings

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `notification_setting_changed` | `app/(app)/settings/notifications/page.tsx` | `{ setting, channel, enabled }` | — |
| `theme_changed` | `app/(app)/settings/account/page.tsx` | `{ theme }` | — |
| `integration_connected` | `app/(app)/settings/integrations/page.tsx` | `{ integration }` | — |
| `integration_disconnected` | `app/(app)/settings/integrations/page.tsx` | `{ integration }` | — |

## Agent

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `ai_assistant_opened` | `app/(app)/help/page.tsx` | `{ source }` | — |
| `ai_assistant_query_sent` | `components/help/ai-assistant-chat-panel.tsx` | `{ message_length }` | — |
| `ai_assistant_response_received` | `components/help/ai-assistant-chat-panel.tsx` | `{ response_length }` | — |
| `ai_assistant_feedback_given` | `components/help/ai-assistant-chat-panel.tsx` | `{ message_id, positive }` | — |

## Reports

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `report_viewed` | `app/(app)/reports/page.tsx` | `{ report }` | — |
| `report_filter_changed` | — | `{ filter }` | — |
| `report_exported` | `components/shared/export-button.tsx` | `{ format }` | Reporting journey |

## Notifications

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `notification_clicked` | `components/layout/notifications-bell.tsx` | `{ notification_id }` | — |
| `notifications_opened` | `components/layout/notifications-bell.tsx` | `{ unread_count }` | — |
| `notifications_marked_all_read` | `components/layout/notifications-bell.tsx` | `{}` | — |

## Flags

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `feature_flag_evaluated` | `lib/flags.ts` → `useFlag()` | `{ flag, value }` | — |

## Landing

| Event | Where fired | Properties | Funnel |
|---|---|---|---|
| `landing_cta_clicked` | `app/(marketing)/page.tsx` | `{ cta, plan? }` | Acquisition journey |

---

## Funnels

### 1. Signup Funnel
`signup_page_viewed` → `signup_email_entered` → `signup_password_entered` → `signup_completed`

### 2. Onboarding Funnel
`onboarding_started` → `onboarding_step_completed` (×4 steps: profile, team, plan, invite) → `onboarding_completed`

### 3. Project Creation Funnel
`project_create_dialog_opened` → `project_created`

### 4. Task Creation Funnel
`task_create_dialog_opened` → `task_created`

### 5. Checkout Funnel
`pricing_page_viewed` → `plan_selected` → `checkout_started` → `payment_method_added` → `checkout_completed`

### 6. Activation Funnel (cross-event)
`signup_completed` → `onboarding_completed` → `project_created` → `task_created` → `task_completed`

---

## Journeys

### Acquisition Journey
`/` → `/sign-up` → `/onboarding/welcome` → `/onboarding/profile` → `/onboarding/team` → `/onboarding/plan` → `/onboarding/invite` → `/dashboard`

### Power-User Journey
`/dashboard` → `/projects` → `/projects/[id]` → `/projects/[id]/tasks/[taskId]`

### Upgrade Journey
`/dashboard` → `/upgrade` → `/checkout` → `/checkout/success` → `/settings/billing`

### Reporting Journey
`/dashboard` → `/reports` → export (report_exported event)

### Help-Seeking Journey
Any page → `/help` → AI assistant chat
