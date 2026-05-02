import { create } from "zustand";

export type ToastItem = {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number; // milliseconds
  createdAt?: number;
};

type ToastState = {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => string;
  remove: (id: string) => void;
  clear: () => void;
};

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (t: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = Date.now();
    const duration = t.duration ?? 6000;
    set((s) => ({
      toasts: [...s.toasts, { id, createdAt, duration, ...t }],
    }));
    return id;
  },
  remove: (id: string) =>
    set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
