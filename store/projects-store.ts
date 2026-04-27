import { create } from "zustand";
import { Project } from "@/types";
import * as api from "@/lib/mock-api";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  load: () => Promise<void>;
  createProject: (data: Omit<Project, "id" | "createdAt">) => Promise<Project>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const projects = await api.getProjects();
    set({ projects, loading: false });
  },

  createProject: async (data) => {
    const project = await api.createProject(data);
    set({ projects: [...get().projects, project] });
    return project;
  },

  updateProject: async (id, patch) => {
    await api.updateProject(id, patch);
    set({ projects: get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  },

  deleteProject: async (id) => {
    await api.deleteProject(id);
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },
}));
