import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2, LayoutDashboard, Plus } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { useOrderStore } from "../store/useOrderStore";
import { StaticWidgetGrid } from "./DashboardPage";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { widgets, fetchDashboard } = useDashboardStore();
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchDashboard();
    fetchOrders("all");
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-muted mt-0.5">Overview of orders and performance analytics</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/configure")}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
        >
          <Settings2 size={15} /> Customize Dashboard
        </button>
      </div>

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
        <StaticWidgetGrid widgets={widgets} orders={orders} />
      )}
    </div>
  );
}
