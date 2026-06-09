export type PendoEventName =
  // Auth & Signup
  | "signup_page_viewed"
  | "signup_email_entered"
  | "signup_password_entered"
  | "signup_completed"
  | "signin_attempted"
  | "signin_succeeded"
  | "signin_failed"
  | "password_reset_requested"
  // Onboarding
  | "onboarding_started"
  | "onboarding_step_viewed"
  | "onboarding_step_completed"
  | "onboarding_skipped"
  | "onboarding_completed"
  // Projects
  | "project_create_dialog_opened"
  | "project_created"
  | "project_renamed"
  | "project_archived"
  | "project_deleted"
  | "project_shared"
  // Tasks
  | "task_create_dialog_opened"
  | "task_created"
  | "task_completed"
  | "task_reopened"
  | "task_assigned"
  | "task_unassigned"
  | "task_priority_changed"
  | "task_due_date_set"
  | "task_label_added"
  | "task_commented"
  | "task_attachment_uploaded"
  | "task_deleted"
  // Views
  | "view_changed_to_kanban"
  | "view_changed_to_list"
  | "view_changed_to_calendar"
  | "view_changed_to_gantt"
  // Filters & search
  | "filter_applied"
  | "filter_cleared"
  | "search_performed"
  | "sort_changed"
  // Bulk
  | "bulk_select_started"
  | "bulk_action_performed"
  // Team
  | "team_member_invited"
  | "team_member_role_changed"
  | "team_member_removed"
  // Billing
  | "pricing_page_viewed"
  | "plan_selected"
  | "checkout_started"
  | "payment_method_added"
  | "checkout_completed"
  | "payment_failed"
  | "subscription_cancelled"
  | "subscription_resumed"
  // Settings
  | "notification_setting_changed"
  | "theme_changed"
  | "integration_connected"
  | "integration_disconnected"
  // Agent
  | "ai_assistant_opened"
  | "ai_assistant_query_sent"
  | "ai_assistant_response_received"
  | "ai_assistant_feedback_given"
  // Reports
  | "report_viewed"
  | "report_filter_changed"
  | "report_exported"
  // Notifications
  | "notification_clicked"
  | "notifications_opened"
  | "notifications_marked_all_read"
  // Flags
  | "feature_flag_evaluated"
  // Landing
  | "landing_cta_clicked"
  // Profile & Account
  | "profile_updated"
  | "account_settings_saved";

export function track(event: PendoEventName, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const p = (window as any).pendo;
  if (p && typeof p.track === "function") p.track(event, properties);
  if (process.env.NODE_ENV !== "production") console.debug("[pendo.track]", event, properties);
}
