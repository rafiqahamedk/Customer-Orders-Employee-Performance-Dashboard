import React, { useState } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import {
  BarChart2, LineChart, PieChart, TrendingUp, ScatterChart,
  Table2, Hash, ChevronDown, ChevronRight,
} from "lucide-react";

const GROUPS = [
  {
    label: "Charts",
    items: [
      { type: "bar", label: "Bar Chart", icon: BarChart2 },
      { type: "line", label: "Line Chart", icon: LineChart },
      { type: "pie", label: "Pie Chart", icon: PieChart },
      { type: "area", label: "Area Chart", icon: TrendingUp },
      { type: "scatter", label: "Scatter Plot", icon: ScatterChart },
    ],
  },
  { label: "Tables", items: [{ type: "table", label: "Table", icon: Table2 }] },
  { label: "KPIs", items: [{ type: "kpi", label: "KPI Value", icon: Hash }] },
];

export default function WidgetPalette() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const [expanded, setExpanded] = useState({ Charts: true, Tables: true, KPIs: true });

  return (
    <aside className="w-52 flex-shrink-0 bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-3 overflow-y-auto scrollbar-thin flex flex-col gap-1">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-widest px-2 pb-1">Widgets</p>
      {GROUPS.map((g) => (
        <div key={g.label}>
          <button
            onClick={() => setExpanded((e) => ({ ...e, [g.label]: !e[g.label] }))}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[11px] font-bold text-muted uppercase tracking-wider hover:text-dark dark:hover:text-white transition-colors"
          >
            {expanded[g.label] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            {g.label}
          </button>
          {expanded[g.label] && (
            <div className="flex flex-col gap-0.5 pl-2">
              {g.items.map(({ type, label, icon: Icon }) => (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("widgetType", type)}
                  onClick={() => addWidget(type)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-dark/70 dark:text-white/60 hover:text-primary hover:bg-primary/10 cursor-grab active:cursor-grabbing transition-all select-none"
                >
                  <Icon size={14} className="flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
