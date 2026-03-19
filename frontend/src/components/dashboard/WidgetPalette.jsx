import React, { useState } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import {
  BarChart2, LineChart, PieChart, TrendingUp, ScatterChart,
  Table2, Hash, ChevronDown, ChevronRight, Plus,
} from "lucide-react";

const GROUPS = [
  {
    label: "Charts",
    items: [
      { type: "bar",     label: "Bar Chart",    icon: BarChart2,    desc: "Compare values" },
      { type: "line",    label: "Line Chart",   icon: LineChart,    desc: "Show trends" },
      { type: "pie",     label: "Pie Chart",    icon: PieChart,     desc: "Show distribution" },
      { type: "area",    label: "Area Chart",   icon: TrendingUp,   desc: "Filled trend" },
      { type: "scatter", label: "Scatter Plot", icon: ScatterChart, desc: "Correlation" },
    ],
  },
  {
    label: "Tables",
    items: [{ type: "table", label: "Data Table", icon: Table2, desc: "Tabular view" }],
  },
  {
    label: "KPIs",
    items: [{ type: "kpi", label: "KPI Card", icon: Hash, desc: "Single metric" }],
  },
];

export default function WidgetPalette() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const [expanded, setExpanded] = useState({ Charts: true, Tables: true, KPIs: true });

  return (
    <aside className="w-52 flex-shrink-0 bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl overflow-y-auto scrollbar-thin flex flex-col">
      <div className="px-3 pt-3 pb-2 border-b border-border dark:border-[#1e2535]">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Add Widgets</p>
        <p className="text-[11px] text-muted/70 mt-0.5">Click to add to dashboard</p>
      </div>
      <div className="flex flex-col gap-0.5 p-2">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <button
              onClick={() => setExpanded((e) => ({ ...e, [g.label]: !e[g.label] }))}
              className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[11px] font-bold text-muted uppercase tracking-wider hover:text-dark dark:hover:text-white transition-colors rounded-lg"
            >
              {expanded[g.label] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              {g.label}
            </button>
            {expanded[g.label] && (
              <div className="flex flex-col gap-0.5 mb-1">
                {g.items.map(({ type, label, icon: Icon, desc }) => (
                  <button
                    key={type}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("widgetType", type)}
                    onClick={() => addWidget(type)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left w-full group hover:bg-primary/10 hover:text-primary transition-all select-none"
                  >
                    <div className="w-7 h-7 rounded-lg bg-bg dark:bg-white/5 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon size={13} className="text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-dark/80 dark:text-white/70 group-hover:text-primary transition-colors">{label}</p>
                      <p className="text-[10px] text-muted/60">{desc}</p>
                    </div>
                    <Plus size={11} className="text-muted/40 group-hover:text-primary transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
