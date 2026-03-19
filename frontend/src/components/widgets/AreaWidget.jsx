import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, LabelList,
} from "recharts";
import { useWidgetData } from "../../hooks/useWidgetData";
import EmptyChart from "./EmptyChart";

export default function AreaWidget({ widget }) {
  const cfg = widget.config || {};
  const { data, isLoading } = useWidgetData(widget);
  const gradientId = `area-grad-${widget.id || "default"}`;

  if (!cfg.xAxis && !cfg.x_axis) return <EmptyChart label="Configure X & Y axis" />;

  if (isLoading) {
    return <div className="h-full w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  }

  const chartData = (data?.labels || []).map((label, i) => ({
    name: label,
    value: data?.values?.[i] || 0,
  }));

  const color = cfg.chart_color || cfg.color || "#54bd95";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
        >
          {(cfg.show_data_labels || cfg.showDataLabel) && (
            <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} />
          )}
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}
