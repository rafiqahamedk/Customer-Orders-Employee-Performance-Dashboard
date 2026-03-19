import React from "react";
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis,
  Tooltip, CartesianGrid, LabelList,
} from "recharts";
import { useWidgetData } from "../../hooks/useWidgetData";
import EmptyChart from "./EmptyChart";

export default function ScatterWidget({ widget }) {
  const cfg = widget.config || {};
  const { data, isLoading } = useWidgetData(widget);

  if (!cfg.xAxis && !cfg.x_axis) return <EmptyChart label="Configure X & Y axis" />;

  if (isLoading) {
    return <div className="h-full w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  }

  const chartData = (data?.labels || []).map((label, i) => ({
    x: i + 1,
    y: data?.values?.[i] || 0,
    name: label,
  }));

  const color = cfg.chart_color || cfg.color || "#54bd95";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" dataKey="x" tick={{ fontSize: 11 }} name="Index" />
        <YAxis type="number" dataKey="y" tick={{ fontSize: 11 }} name="Value" />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
          formatter={(value, name, props) => {
            if (name === "y") return [value, "Value"];
            return [props.payload.name, "Label"];
          }}
        />
        <Scatter data={chartData} fill={color}>
          {(cfg.show_data_labels || cfg.showDataLabel) && (
            <LabelList dataKey="y" position="top" style={{ fontSize: 10 }} />
          )}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
