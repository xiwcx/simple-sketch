import { create } from "zustand";

export type Tool = "move" | "select" | "create-rectangle";
export type SelectCurrentTool = (tool: Tool) => void;

interface ToolStore {
  current: Tool;
  selectCurrent: SelectCurrentTool;
}

export const useToolStore = create<ToolStore>((set) => ({
  current: "move",
  selectCurrent: (tool: Tool) => set(() => ({ current: tool })),
}));
