import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  keyboardShortcutsOpen: boolean;
  toggleSidebar: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openKeyboardShortcuts: () => void;
  closeKeyboardShortcuts: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  keyboardShortcutsOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  openKeyboardShortcuts: () => set({ keyboardShortcutsOpen: true }),
  closeKeyboardShortcuts: () => set({ keyboardShortcutsOpen: false }),
}));
