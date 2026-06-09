"use client";

import { create } from "zustand";

interface WorkspaceStore {
  currentWorkspaceId: string | null;
  setCurrentWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspaceId: null,
  setCurrentWorkspace: (id) => set({ currentWorkspaceId: id }),
}));
