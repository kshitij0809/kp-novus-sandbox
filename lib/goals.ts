export const GOALS = [
  {
    id: "g_activation",
    name: "70% of new signups complete onboarding",
    metric: "onboarding_completed / signup_completed",
    target: 0.7,
    referenceFunnel: "onboarding",
    currentValue: 0.62,
  },
  {
    id: "g_project_setup",
    name: "85% of accounts create a project in first 24h",
    metric: "first_project_within_24h_rate",
    target: 0.85,
    currentValue: 0.71,
  },
  {
    id: "g_first_task",
    name: "60% of activated users complete a task in first week",
    metric: "first_task_completion_rate",
    target: 0.6,
    currentValue: 0.48,
  },
  {
    id: "g_mrr",
    name: "Reach $50k MRR",
    metric: "account.mrr_sum",
    target: 50000,
    currentValue: 31200,
  },
  {
    id: "g_checkout",
    name: "Reduce checkout drop-off below 30%",
    metric: "checkout_dropoff_rate",
    target: 0.3,
    direction: "decrease" as const,
    currentValue: 0.42,
  },
  {
    id: "g_retention",
    name: "30-day weekly retention above 40%",
    metric: "wk_retention",
    target: 0.4,
    currentValue: 0.34,
  },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];
