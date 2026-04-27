import { create } from "zustand";
import { Task } from "@/types";
import * as api from "@/lib/mock-api";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  load: () => Promise<void>;
  loadForProject: (projectId: string) => Promise<void>;
  createTask: (data: Omit<Task, "id" | "createdAt" | "comments" | "attachments" | "completedAt">) => Promise<Task>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, userId: string, body: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const tasks = await api.getTasks();
    set({ tasks, loading: false });
  },

  loadForProject: async (projectId: string) => {
    set({ loading: true });
    const tasks = await api.getTasksByProject(projectId);
    set({ tasks, loading: false });
  },

  createTask: async (data) => {
    const task = await api.createTask(data);
    set({ tasks: [...get().tasks, task] });
    return task;
  },

  updateTask: async (id, patch) => {
    const updated = await api.updateTask(id, patch);
    set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) });
  },

  deleteTask: async (id) => {
    await api.deleteTask(id);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },

  addComment: async (taskId, userId, body) => {
    const updated = await api.addComment(taskId, userId, body);
    set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) });
  },
}));
