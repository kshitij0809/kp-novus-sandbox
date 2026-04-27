export const GUIDES = [
  {
    id: "welcome_dashboard",
    trigger: "first dashboard visit",
    type: "tooltip",
    title: "Welcome to TaskPilot!",
    body: "This is your dashboard. Let's get you set up for success.",
  },
  {
    id: "kanban_intro",
    trigger: "first kanban view",
    type: "walkthrough",
    title: "Manage your tasks visually",
    body: "Drag cards between columns to update task status.",
  },
  {
    id: "nps_14d",
    trigger: "14 days after signup",
    type: "poll",
    question: "How likely are you to recommend TaskPilot?",
  },
  {
    id: "ai_assistant_announce",
    trigger: "announce ai_assistant_v2",
    type: "banner",
    title: "New: AI Assistant is here!",
    body: "Ask questions, get task summaries, and more.",
  },
  {
    id: "reports_walkthrough",
    trigger: "first reports visit",
    type: "walkthrough",
    title: "Understand your team's performance",
    body: "Use reports to track completion rates, velocity, and goals.",
  },
  {
    id: "upgrade_promo",
    trigger: "free user, 7d active",
    type: "banner",
    title: "You're using TaskPilot like a pro!",
    body: "Upgrade to Pro to unlock Gantt views, advanced reports, and more.",
  },
] as const;

export type GuideId = (typeof GUIDES)[number]["id"];
