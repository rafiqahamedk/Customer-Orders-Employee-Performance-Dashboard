import { create } from "zustand";

const saved = localStorage.getItem("hx_theme") || "light";
if (saved === "dark") document.documentElement.classList.add("dark");

export const useThemeStore = create((set) => ({
  theme: saved,
  toggle: () => {
    set((s) => {
      const next = s.theme === "light" ? "dark" : "light";
      localStorage.setItem("hx_theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return { theme: next };
    });
  },
}));
