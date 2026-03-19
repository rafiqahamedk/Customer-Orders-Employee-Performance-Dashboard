import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useDashboardStore } from "../store/useDashboardStore";
import WidgetPalette from "../components/dashboard/WidgetPalette";
import ConfigCanvas from "../components/dashboard/ConfigCanvas";
import WidgetConfigPanel from "../components/dashboard/WidgetConfigPanel";

export default function DashboardConfigPage() {
  const navigate = useNavigate();
  const { widgets, fetchDashboard, saveDashboard, addWidget, updateLayout, deleteWidget } = useDashboardStore();
  const [activeWidgetId, setActiveWidgetId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDashboard();
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/dashboard");
      }, 900);
    } finally {
      setSaving(false);
    }
  };

  const handleConfigure = (id) => {
    setActiveWidgetId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id) => {
    deleteWidget(id);
    if (activeWidgetId === id) setActiveWidgetId(null);
  };

  const handleLayoutChange = useCallback((layout) => {
    updateLayout(layout);
  }, [updateLayout]);

  // Drop from palette
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("widgetType");
    if (type) addWidget(type);
  }, [addWidget]);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 flex-shrink-0">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border dark:border-[#1e2535] text-muted text-sm hover:border-primary hover:text-primary transition-all"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-dark dark:text-white">Customize Dashboard</h1>
          <p className="text-xs text-muted mt-0.5">
            Drag widgets from the palette, then hover a widget and click the settings icon to configure it
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={[
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all",
            saved
              ? "bg-emerald-500 text-white shadow-emerald-500/25"
              : "bg-primary hover:bg-primary-dark disabled:opacity-60 text-white shadow-primary/25",
          ].join(" ")}
        >
          {saved ? (
            <><Check size={15} /> Saved</>
          ) : saving ? (
            <><Save size={15} /> Saving...</>
          ) : (
            <><Save size={15} /> Save Layout</>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
        <WidgetPalette />

        {/* Canvas area */}
        <div
          className="flex-1 bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl overflow-y-auto relative min-h-0"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {widgets.length === 0 ? (
            <div className="absolute inset-4 flex flex-col items-center justify-center border-2 border-dashed border-border dark:border-[#1e2535] rounded-xl pointer-events-none gap-2">
              <p className="text-sm text-muted font-medium">Drag & drop widgets here</p>
              <p className="text-xs text-muted/60">Or click a widget from the panel on the left</p>
            </div>
          ) : (
            <ConfigCanvas
              widgets={widgets}
              editable={true}
              onLayoutChange={handleLayoutChange}
              onConfigure={handleConfigure}
              onDelete={handleDelete}
            />
          )}
        </div>

        {activeWidgetId && (
          <WidgetConfigPanel
            widgetId={activeWidgetId}
            onClose={() => setActiveWidgetId(null)}
          />
        )}
      </div>
    </div>
  );
}
