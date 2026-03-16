import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2 } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { useOrderStore } from "../store/useOrderStore";
import DateFilter from "../components/dashboard/DateFilter";
import WidgetRenderer from "../components/widgets/WidgetRenderer";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import useBreakpoint from "../hooks/useBreakpoint";

const ResponsiveGrid = WidthProvider(Responsive);
const BREAKPOINTS = { lg: 1200, md: 768, sm: 0 };
const COLS = { lg: 12, md: 8, sm: 4 };

export default function DashboardPage() {
  const navigate = useNavigate();
  const { widgets, dateFilter, fetchDashboard, setDateFilter } = useDashboardStore();
  const { orders, fetchOrders } = useOrderStore();
  const bp = useBreakpoint();

  useEffect(() => { fetchDashboard(); }, []);
  useEffect(() => { fetchOrders(dateFilter); }, [dateFilter]);

  const layouts = {
    lg: widgets.map((w) => ({ i: w.id, x: w.layout.x, y: w.layout.y, w: Math.min(w.layout.w, 12), h: w.layout.h, static: true })),
    md: widgets.map((w) => ({ i: w.id, x: Math.min(w.layout.x, 7), y: w.layout.y, w: Math.min(w.layout.w, 8), h: w.layout.h, static: true })),
    sm: widgets.map((w) => ({ i: w.id, x: 0, y: w.layout.y, w: Math.min(w.layout.w, 4), h: w.layout.h, static: true })),
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
          <p className="text-sm text-muted mt-0.5">Your personalized analytics overview</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <DateFilter value={dateFilter} onChange={setDateFilter} />
          <button
            onClick={() => navigate("/dashboard/configure")}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all duration-150"
          >
            <Settings2 size={15} /> Configure Dashboard
          </button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-surface rounded-2xl border-2 border-dashed border-border gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Settings2 size={28} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-dark">No widgets configured</p>
            <p className="text-sm text-muted mt-1">Click below to build your dashboard</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/configure")}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
          >
            <Settings2 size={15} /> Configure Dashboard
          </button>
        </div>
      ) : (
        <ResponsiveGrid layouts={layouts} breakpoints={BREAKPOINTS} cols={COLS} rowHeight={80} isDraggable={false} isResizable={false}>
          {widgets.map((w) => (
            <div key={w.id} className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden">
              <WidgetRenderer widget={w} orders={orders} />
            </div>
          ))}
        </ResponsiveGrid>
      )}
    </div>
  );
}
