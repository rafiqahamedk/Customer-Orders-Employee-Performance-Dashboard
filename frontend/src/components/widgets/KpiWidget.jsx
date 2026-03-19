import React from "react";
import { TrendingUp, Settings2 } from "lucide-react";
import { useWidgetData } from "../../hooks/useWidgetData";

function formatVal(value, format, precision) {
  const n = parseFloat(value) || 0;
  const fixed = n.toFixed(precision ?? 0);
  const localized = parseFloat(fixed).toLocaleString(undefined, {
    minimumFractionDigits: precision ?? 0,
    maximumFractionDigits: precision ?? 0,
  });
  return format === "currency" ? `$${localized}` : localized;
}

export default function KpiWidget({ widget }) {
  const cfg = widget.config || {};
  const { data, isLoading } = useWidgetData(widget);

  if (!cfg.metric && !cfg.aggregation) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-muted p-4">
        <Settings2 size={22} className="opacity-30" />
        <p className="text-xs text-center text-muted">Click the settings icon to configure this KPI</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 p-4">
        <div className="w-24 h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-32 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    );
  }

  const value = data?.total ?? 0;
  const display = formatVal(value, cfg.data_format || cfg.dataFormat, cfg.decimal_precision ?? cfg.decimalPrecision);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
        <TrendingUp size={18} className="text-primary" />
      </div>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">{widget.title}</p>
      <p className="text-4xl font-bold text-dark dark:text-white leading-none">{display}</p>
      {widget.description && <p className="text-xs text-muted mt-1">{widget.description}</p>}
    </div>
  );
}
