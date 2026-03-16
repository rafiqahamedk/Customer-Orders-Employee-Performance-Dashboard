import React from "react";
import { aggregate, formatValue } from "../../utils/dataHelpers";
import { TrendingUp } from "lucide-react";

export default function KpiWidget({ widget, orders }) {
  const cfg = widget.config || {};
  const value = aggregate(orders, cfg.metric, cfg.aggregation || "count");
  const display = formatValue(value, cfg.dataFormat, cfg.decimalPrecision);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
        <TrendingUp size={18} className="text-primary" />
      </div>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">{widget.title}</p>
      <p className="text-4xl font-bold text-dark leading-none">{display}</p>
      {widget.description && <p className="text-xs text-muted mt-1">{widget.description}</p>}
    </div>
  );
}
