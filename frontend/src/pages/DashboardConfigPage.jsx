import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { useOrderStore } from "../store/useOrderStore";
import WidgetPalette from "../components/dashboard/WidgetPalette";
import ConfigCanvas from "../components/dashboard/ConfigCanvas";
import WidgetConfigPanel from "../components/dashboard/WidgetConfigPanel";

export default function DashboardConfigPage() {
  const navigate = useNavigate();
  const { fetchDashboard, saveDashboard } = useDashboardStore();
  const { fetchOrders } = useOrderStore();
  const [activeWidget, setActiveWidget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchDashboard(); fetchOrders("all"); }, []);

  const handleSave = async () => {
    setSaving(true);
    await saveDashboard();
    setSaving(false);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] gap-0">
      {/* Header */}
      <div className="flex items-center gap-3 pb-5 flex-shrink-0">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border dark:border-[#1e2535] text-muted text-sm hover:border-primary hover:text-primary transition-all"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-dark dark:text-white">Customize Dashboard</h1>
          <p className="text-xs text-muted mt-0.5">Add widgets, configure data fields, resize and arrange your layout</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
        >
          <Save size={15} /> {saving ? "Saving..." : "Save Layout"}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
        <WidgetPalette />
        <ConfigCanvas onSelectWidget={setActiveWidget} activeWidgetId={activeWidget?.id} />
        {activeWidget && (
          <WidgetConfigPanel widget={activeWidget} onClose={() => setActiveWidget(null)} />
        )}
      </div>
    </div>
  );
}
