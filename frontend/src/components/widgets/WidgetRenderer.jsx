import React from "react";
import KpiWidget from "./KpiWidget";
import BarWidget from "./BarWidget";
import LineWidget from "./LineWidget";
import AreaWidget from "./AreaWidget";
import ScatterWidget from "./ScatterWidget";
import PieWidget from "./PieWidget";
import TableWidget from "./TableWidget";

export default function WidgetRenderer({ widget, orders }) {
  const props = { widget, orders };
  switch (widget.type) {
    case "kpi":     return <KpiWidget {...props} />;
    case "bar":     return <BarWidget {...props} />;
    case "line":    return <LineWidget {...props} />;
    case "area":    return <AreaWidget {...props} />;
    case "scatter": return <ScatterWidget {...props} />;
    case "pie":     return <PieWidget {...props} />;
    case "table":   return <TableWidget {...props} />;
    default:        return <div style={{ padding: 16, color: "#999" }}>Unknown widget</div>;
  }
}
