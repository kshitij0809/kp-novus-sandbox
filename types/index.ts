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
  signupDate: string;
  lastLogin: string;
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

export interface Notification {
  id: string;
  userId: string;
  type: "task_assigned" | "comment_added" | "due_soon" | "task_completed";
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
  projectId?: string;
}
