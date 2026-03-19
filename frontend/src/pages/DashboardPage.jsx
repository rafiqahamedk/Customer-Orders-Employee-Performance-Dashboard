import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2, LayoutDashboard } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import DateFilter from "../components/dashboard/DateFilter";
import ConfigCanvas from "../components/dashboard/ConfigCanvas";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { widgets, dateFilter, fetchDashboard, setDateFilter } = useDashboardStore();

  useEffect(() => { fetchDashboard(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Dashboard</h1>
          <p className="text-sm text-muted mt-0.5">Your personalized analytics overview</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <DateFilter value={dateFilter} onChange={setDateFilter} />
          <button
            onClick={() => navigate("/dashboard/configure")}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
          >
            <Settings2 size={15} /> Configure Dashboard
          </button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <DashboardEmptyState onConfigure={() => navigate("/dashboard/configure")} />
      ) : (
        <ConfigCanvas
          widgets={widgets}
          editable={false}
        />
      )}
    </div>
  );
}

function DashboardEmptyState({ onConfigure }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] bg-white dark:bg-[#161b27] rounded-2xl border-2 border-dashed border-border dark:border-[#1e2535] gap-4">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <LayoutDashboard size={26} className="text-primary" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-dark dark:text-white">No widgets configured</p>
        <p className="text-sm text-muted mt-1">Build your dashboard by adding widgets</p>
      </div>
      <button
        onClick={onConfigure}
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
      >
        <Settings2 size={15} /> Configure Dashboard
      </button>
    </div>
  );
}

// Exported for AdminDashboardPage / EmployeeDashboardPage
export function StaticWidgetGrid({ widgets }) {
  return (
    <ConfigCanvas widgets={widgets} editable={false} />
  );
}
