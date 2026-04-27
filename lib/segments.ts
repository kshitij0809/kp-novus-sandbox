export const SEGMENTS = [
  {
    id: "trial_expiring",
    name: "Trial users about to expire",
    criteria: "account.plan == 'free' && account.trialEndDate within 7 days",
  },
  {
    id: "power_users",
    name: "Power users (10+ active projects)",
    criteria: "account.activeProjects >= 10",
  },
  {
    id: "free_team",
    name: "Free tier with 1+ team members",
    criteria: "account.plan == 'free' && account.teamSize > 1",
  },
  {
    id: "enterprise_admins",
    name: "Enterprise admins",
    criteria: "user.role == 'admin' && account.plan == 'enterprise'",
  },
  {
    id: "low_activity",
    name: "Low activity (no task created in 7d)",
    criteria: "no task_created in last 7 days",
  },
] as const;

export type SegmentId = (typeof SEGMENTS)[number]["id"];
