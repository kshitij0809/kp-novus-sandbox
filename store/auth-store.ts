import { create } from "zustand";
import { User, Account } from "@/types";
import { SEED_USERS, SEED_ACCOUNT } from "@/lib/seed";
import { seedIfNeeded } from "@/lib/mock-api";

interface AuthState {
  authenticated: boolean;
  user: User | null;
  account: Account | null;
  signIn: (email: string) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

function getUserForEmail(email: string): User {
  const found = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (found) return { ...found, lastLogin: new Date().toISOString() };
  return {
    ...SEED_USERS[0],
    email,
    id: `user_${Date.now()}`,
    lastLogin: new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authenticated: false,
  user: null,
  account: null,

  signIn: (email: string) => {
    seedIfNeeded();
    const user = getUserForEmail(email);
    if (typeof window !== "undefined") {
      localStorage.setItem("tp_current_user_id", user.id);
    }
    set({ authenticated: true, user, account: SEED_ACCOUNT });
  },

  signOut: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tp_current_user_id");
    }
    set({ authenticated: false, user: null, account: null });
  },

  updateProfile: (patch: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...patch };
    set({ user: updated });
  },
}));
