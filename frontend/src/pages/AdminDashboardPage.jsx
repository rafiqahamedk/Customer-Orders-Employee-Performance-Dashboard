import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2, Plus, LayoutDashboard } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { useOrderStore } from "../store/useOrderStore";
import WidgetRenderer from "../components/widgets/WidgetRenderer";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGrid = WidthProvider(Responsive);
const BREAKPOINTS = { lg: 1200, md: 768, sm: 0 };
const COLS = { lg: 12, md: 8, sm: 4 };

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { widgets, fetchDashboard } = useDashboardStore();
  const { orders: storeOrders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchDashboard();
    fetchOrders("all");
  }, []);

  const layouts = {
    lg: widgets.map((w) => ({ i: w.id, x: w.layout.x, y: w.layout.y, w: Math.min(w.layout.w, 12), h: w.layout.h, static: true })),
    md: widgets.map((w) => ({ i: w.id, x: Math.min(w.layout.x, 7), y: w.layout.y, w: Math.min(w.layout.w, 8), h: w.layout.h, static: true })),
    sm: widgets.map((w) => ({ i: w.id, x: 0, y: w.layout.y, w: 4, h: w.layout.h, static: true })),
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-muted mt-0.5">Overview of orders and analytics</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/configure")}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
        >
          <Settings2 size={15} /> Customize Dashboard
        </button>
      </div>

      {/* Custom Widget Area */}
      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white dark:bg-[#161b27] rounded-2xl border-2 border-dashed border-border dark:border-[#1e2535] gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard size={26} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-dark dark:text-white">No widgets yet</p>
            <p className="text-sm text-muted mt-1">Add charts, KPIs and tables to build your analytics view</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/configure")}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
          >
            <Plus size={15} /> Add Widgets
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={15} className="text-primary" />
              <span className="text-sm font-semibold text-dark dark:text-white">Custom Widgets</span>
            </div>
            <button
              onClick={() => navigate("/dashboard/configure")}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <Settings2 size={13} /> Edit
            </button>
          </div>
          <ResponsiveGrid layouts={layouts} breakpoints={BREAKPOINTS} cols={COLS} rowHeight={80} isDraggable={false} isResizable={false}>
            {widgets.map((w) => (
              <div key={w.id} className="bg-bg dark:bg-[#0d1117] rounded-2xl border border-border dark:border-[#1e2535] overflow-hidden">
                <WidgetRenderer widget={w} orders={storeOrders} />
              </div>
            ))}
          </ResponsiveGrid>
        </div>
      )}
    </div>
  );
}
