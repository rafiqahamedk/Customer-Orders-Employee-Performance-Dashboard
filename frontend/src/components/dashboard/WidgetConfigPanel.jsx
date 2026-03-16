import React from "react";
import { X } from "lucide-react";
import { useDashboardStore } from "../../store/useDashboardStore";
import KpiConfig from "./configs/KpiConfig";
import ChartConfig from "./configs/ChartConfig";
import PieConfig from "./configs/PieConfig";
import TableConfig from "./configs/TableConfig";

const TYPE_LABELS = {
  bar: "Bar Chart", line: "Line Chart", area: "Area Chart",
  scatter: "Scatter Plot", pie: "Pie Chart", table: "Table", kpi: "KPI Value",
};

export default function WidgetConfigPanel({ widget, onClose }) {
  const updateWidgetConfig = useDashboardStore((s) => s.updateWidgetConfig);
  const patch = (data) => updateWidgetConfig(widget.id, data);
  const patchConfig = (cfg) => updateWidgetConfig(widget.id, { config: cfg });

  const renderConfig = () => {
    if (widget.type === "kpi") return <KpiConfig widget={widget} patch={patch} patchConfig={patchConfig} />;
    if (widget.type === "pie") return <PieConfig widget={widget} patch={patch} patchConfig={patchConfig} />;
    if (widget.type === "table") return <TableConfig widget={widget} patch={patch} patchConfig={patchConfig} />;
    return <ChartConfig widget={widget} patch={patch} patchConfig={patchConfig} />;
  };

  return (
    <aside className="w-80 flex-shrink-0 bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl flex flex-col overflow-hidden shadow-panel">
      <div className="flex items-start justify-between p-4 border-b border-border dark:border-[#1e2535] flex-shrink-0">
        <div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Widget Settings</p>
          <h2 className="text-base font-bold text-dark dark:text-white mt-0.5">{TYPE_LABELS[widget.type]}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:bg-bg dark:hover:bg-white/10 hover:text-dark dark:hover:text-white transition-all"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col gap-4">
        {renderConfig()}
      </div>
    </aside>
  );
}
