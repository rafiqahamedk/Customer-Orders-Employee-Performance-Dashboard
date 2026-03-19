import React from "react";
import KpiWidget from "./KpiWidget";
import BarWidget from "./BarWidget";
import LineWidget from "./LineWidget";
import AreaWidget from "./AreaWidget";
import ScatterWidget from "./ScatterWidget";
import PieWidget from "./PieWidget";
import TableWidget from "./TableWidget";

// Supports both old short names (kpi, bar, line...) and spec names (kpi, bar_chart, line_chart...)
const WIDGET_MAP = {
  kpi: KpiWidget,
  bar: BarWidget,
  bar_chart: BarWidget,
  line: LineWidget,
  line_chart: LineWidget,
  area: AreaWidget,
  area_chart: AreaWidget,
  scatter: ScatterWidget,
  scatter_plot: ScatterWidget,
  pie: PieWidget,
  pie_chart: PieWidget,
  table: TableWidget,
};

export default function WidgetRenderer({ widget }) {
  const type = widget?.widget_type || widget?.type;
  const Component = WIDGET_MAP[type];
  if (!Component) return <div className="p-4 text-muted text-sm">Unknown widget type: {type}</div>;
  return <Component widget={widget} />;
}
