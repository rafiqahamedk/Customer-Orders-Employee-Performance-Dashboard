import { create } from "zustand";
import { dashboardApi } from "../utils/api";

const DEFAULT_SIZES = {
  kpi:     { w: 2, h: 2 },
  bar:     { w: 5, h: 5 },
  line:    { w: 5, h: 5 },
  area:    { w: 5, h: 5 },
  scatter: { w: 5, h: 5 },
  pie:     { w: 4, h: 4 },
  table:   { w: 4, h: 4 },
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export const useDashboardStore = create((set, get) => ({
  widgets: [],
  dateFilter: "all",
  loading: false,
  saved: true,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const data = await dashboardApi.get();
      set({ widgets: data.widgets || [], dateFilter: data.dateFilter || "all", loading: false });
    } catch {
      set({ loading: false });
    }
  },

  saveDashboard: async () => {
    const { widgets, dateFilter } = get();
    await dashboardApi.save({ widgets, dateFilter });
    set({ saved: true });
  },

  setDateFilter: (dateFilter) => set({ dateFilter, saved: false }),

  addWidget: (type) => {
    const size = DEFAULT_SIZES[type] || { w: 4, h: 4 };
    const widget = {
      id: makeId(),
      type,
      title: "Untitled",
      description: "",
      layout: { x: 0, y: Infinity, w: size.w, h: size.h },
      config: {},
    };
    set((s) => ({ widgets: [...s.widgets, widget], saved: false }));
  },

  updateWidgetLayout: (layouts) => {
    set((s) => ({
      widgets: s.widgets.map((w) => {
        const l = layouts.find((l) => l.i === w.id);
        if (!l) return w;
        return { ...w, layout: { x: l.x, y: l.y, w: l.w, h: l.h } };
      }),
      saved: false,
    }));
  },

  updateWidgetConfig: (id, patch) => {
    set((s) => ({
      widgets: s.widgets.map((w) =>
        w.id === id ? { ...w, ...patch, config: { ...w.config, ...patch.config } } : w
      ),
      saved: false,
    }));
  },

  deleteWidget: (id) => {
    set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id), saved: false }));
  },
}));
