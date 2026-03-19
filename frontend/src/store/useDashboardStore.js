import { create } from "zustand";
import { dashboardApi } from "../utils/api";

const DEFAULT_SIZES = {
  kpi:          { w: 3, h: 3 },
  bar:          { w: 6, h: 5 },
  bar_chart:    { w: 6, h: 5 },
  line:         { w: 6, h: 5 },
  line_chart:   { w: 6, h: 5 },
  area:         { w: 6, h: 5 },
  area_chart:   { w: 6, h: 5 },
  scatter:      { w: 6, h: 5 },
  scatter_plot: { w: 6, h: 5 },
  pie:          { w: 4, h: 5 },
  pie_chart:    { w: 4, h: 5 },
  table:        { w: 12, h: 6 },
};

let _counter = Date.now();
function makeId() {
  return "w_" + (++_counter).toString(36);
}

// Normalize a widget from DB (may use grid_x/grid_y or layout.x/layout.y)
function normalizeWidget(w) {
  return {
    ...w,
    id: w.id || w._id?.toString() || makeId(),
    // Prefer grid_x/y/w/h (spec format), fall back to layout object
    grid_x: w.grid_x ?? w.layout?.x ?? 0,
    grid_y: w.grid_y ?? w.layout?.y ?? 0,
    grid_w: w.grid_w ?? w.layout?.w ?? 4,
    grid_h: w.grid_h ?? w.layout?.h ?? 4,
    config: w.config || {},
  };
}

export const useDashboardStore = create((set, get) => ({
  widgets: [],
  dateFilter: "all",
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const data = await dashboardApi.get();
      const widgets = (data.widgets || []).map(normalizeWidget);
      set({ widgets, dateFilter: data.dateFilter || "all", loading: false });
    } catch {
      set({ loading: false });
    }
  },

  saveDashboard: async () => {
    const { widgets, dateFilter } = get();
    // Save using spec field names
    const payload = widgets.map((w) => ({
      widget_type: w.widget_type || w.type,
      title: w.title || "Untitled",
      description: w.description || "",
      config: w.config || {},
      grid_x: w.grid_x ?? 0,
      grid_y: w.grid_y ?? 0,
      grid_w: w.grid_w ?? 4,
      grid_h: w.grid_h ?? 4,
    }));
    await dashboardApi.save({ widgets: payload, dateFilter });
  },

  setDateFilter: (dateFilter) => set({ dateFilter }),

  addWidget: (type) => {
    const size = DEFAULT_SIZES[type] || { w: 4, h: 4 };
    const widgets = get().widgets;
    const maxY = widgets.reduce((m, w) => Math.max(m, (w.grid_y ?? 0) + (w.grid_h ?? 4)), 0);
    const id = makeId();
    const widget = {
      id,
      widget_type: type,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " "),
      description: "",
      grid_x: 0,
      grid_y: maxY,
      grid_w: size.w,
      grid_h: size.h,
      config: {},
    };
    set((s) => ({ widgets: [...s.widgets, widget] }));
    return id;
  },

  updateWidget: (id, patch) => {
    set((s) => ({
      widgets: s.widgets.map((w) => {
        if (w.id !== id) return w;
        const next = { ...w };
        if (patch.title !== undefined) next.title = patch.title;
        if (patch.description !== undefined) next.description = patch.description;
        if (patch.grid_w !== undefined) next.grid_w = patch.grid_w;
        if (patch.grid_h !== undefined) next.grid_h = patch.grid_h;
        // Legacy layout support
        if (patch.layout) {
          next.grid_x = patch.layout.x ?? next.grid_x;
          next.grid_y = patch.layout.y ?? next.grid_y;
          next.grid_w = patch.layout.w ?? next.grid_w;
          next.grid_h = patch.layout.h ?? next.grid_h;
        }
        if (patch.config) next.config = { ...w.config, ...patch.config };
        return next;
      }),
    }));
  },

  // Called by ConfigCanvas when grid layout changes (drag/resize)
  updateLayout: (layout) => {
    set((s) => ({
      widgets: s.widgets.map((w) => {
        const item = layout.find((l) => l.i === w.id);
        if (!item) return w;
        return { ...w, grid_x: item.x, grid_y: item.y, grid_w: item.w, grid_h: item.h };
      }),
    }));
  },

  deleteWidget: (id) => {
    set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) }));
  },
}));
