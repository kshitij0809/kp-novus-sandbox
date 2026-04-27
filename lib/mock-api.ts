import { User, Account, Project, Task, Notification } from "@/types";
import {
  SEED_ACCOUNT,
  SEED_USERS,
  SEED_PROJECTS,
  SEED_TASKS,
  SEED_NOTIFICATIONS,
} from "./seed";

const STORAGE_KEYS = {
  seeded: "tp_seeded",
  account: "tp_account",
  users: "tp_users",
  projects: "tp_projects",
  tasks: "tp_tasks",
  notifications: "tp_notifications",
  onboardingDone: "tp_onboarding_done",
  checklistDismissed: "tp_checklist_dismissed",
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function seedIfNeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(STORAGE_KEYS.seeded)) return;
  write(STORAGE_KEYS.account, SEED_ACCOUNT);
  write(STORAGE_KEYS.users, SEED_USERS);
  write(STORAGE_KEYS.projects, SEED_PROJECTS);
  write(STORAGE_KEYS.tasks, SEED_TASKS);
  write(STORAGE_KEYS.notifications, SEED_NOTIFICATIONS);
  localStorage.setItem(STORAGE_KEYS.seeded, "true");
}

// Account
export async function getAccount(): Promise<Account> {
  seedIfNeeded();
  return read<Account>(STORAGE_KEYS.account) ?? SEED_ACCOUNT;
}

// Users
export async function getUsers(): Promise<User[]> {
  seedIfNeeded();
  return read<User[]>(STORAGE_KEYS.users) ?? SEED_USERS;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function updateUser(id: string, patch: Partial<User>): Promise<User> {
  const users = await getUsers();
  const updated = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
  write(STORAGE_KEYS.users, updated);
  return updated.find((u) => u.id === id)!;
}

// Projects
export async function getProjects(): Promise<Project[]> {
  seedIfNeeded();
  return read<Project[]>(STORAGE_KEYS.projects) ?? SEED_PROJECTS;
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export async function createProject(data: Omit<Project, "id" | "createdAt">): Promise<Project> {
  const projects = await getProjects();
  const project: Project = {
    ...data,
    id: `proj_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  write(STORAGE_KEYS.projects, [...projects, project]);
  return project;
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<Project> {
  const projects = await getProjects();
  const updated = projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
  write(STORAGE_KEYS.projects, updated);
  return updated.find((p) => p.id === id)!;
}

export async function deleteProject(id: string): Promise<void> {
  const projects = await getProjects();
  write(
    STORAGE_KEYS.projects,
    projects.filter((p) => p.id !== id)
  );
}

// Tasks
export async function getTasks(): Promise<Task[]> {
  seedIfNeeded();
  return read<Task[]>(STORAGE_KEYS.tasks) ?? SEED_TASKS;
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter((t) => t.projectId === projectId);
}

export async function getTask(id: string): Promise<Task | null> {
  const tasks = await getTasks();
  return tasks.find((t) => t.id === id) ?? null;
}

export async function createTask(data: Omit<Task, "id" | "createdAt" | "comments" | "attachments" | "completedAt">): Promise<Task> {
  const tasks = await getTasks();
  const task: Task = {
    ...data,
    id: `task_${Date.now()}`,
    createdAt: new Date().toISOString(),
    comments: [],
    attachments: [],
    completedAt: null,
  };
  write(STORAGE_KEYS.tasks, [...tasks, task]);
  return task;
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<Task> {
  const tasks = await getTasks();
  const updated = tasks.map((t) => {
    if (t.id !== id) return t;
    const next = { ...t, ...patch };
    if (patch.status === "done" && !t.completedAt) {
      next.completedAt = new Date().toISOString();
    }
    if (patch.status && patch.status !== "done") {
      next.completedAt = null;
    }
    return next;
  });
  write(STORAGE_KEYS.tasks, updated);
  return updated.find((t) => t.id === id)!;
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = await getTasks();
  write(
    STORAGE_KEYS.tasks,
    tasks.filter((t) => t.id !== id)
  );
}

export async function addComment(taskId: string, userId: string, body: string): Promise<Task> {
  const task = await getTask(taskId);
  if (!task) throw new Error("Task not found");
  const comment = { id: `c_${Date.now()}`, userId, body, at: new Date().toISOString() };
  return updateTask(taskId, { comments: [...task.comments, comment] });
}

// Notifications
export async function getNotifications(userId: string): Promise<Notification[]> {
  seedIfNeeded();
  const all = read<Notification[]>(STORAGE_KEYS.notifications) ?? SEED_NOTIFICATIONS;
  return all.filter((n) => n.userId === userId);
}

export async function markNotificationRead(id: string): Promise<void> {
  const all = read<Notification[]>(STORAGE_KEYS.notifications) ?? [];
  write(
    STORAGE_KEYS.notifications,
    all.map((n) => (n.id === id ? { ...n, read: true } : n))
  );
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const all = read<Notification[]>(STORAGE_KEYS.notifications) ?? [];
  write(
    STORAGE_KEYS.notifications,
    all.map((n) => (n.userId === userId ? { ...n, read: true } : n))
  );
}

// Onboarding state
export function getOnboardingDone(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.onboardingDone) === "true";
}

export function setOnboardingDone() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.onboardingDone, "true");
}

export function getChecklistDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.checklistDismissed) === "true";
}

export function setChecklistDismissed() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.checklistDismissed, "true");
}
