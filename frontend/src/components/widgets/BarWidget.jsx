import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, LabelList,
} from "recharts";
import { useWidgetData } from "../../hooks/useWidgetData";
import EmptyChart from "./EmptyChart";

export default function BarWidget({ widget }) {
  const cfg = widget.config || {};
  const { data, isLoading } = useWidgetData(widget);

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
      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}>
          {(cfg.show_data_labels || cfg.showDataLabel) && (
            <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
