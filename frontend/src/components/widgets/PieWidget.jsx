import React from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from "recharts";
import { useWidgetData } from "../../hooks/useWidgetData";
import EmptyChart from "./EmptyChart";

const PIE_COLORS = [
  "#54bd95", "#4f46e5", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#10b981", "#f97316", "#6366f1",
];

export default function PieWidget({ widget }) {
  const cfg = widget.config || {};
  const { data, isLoading } = useWidgetData(widget);

  if (!cfg.chart_data && !cfg.chartData) return <EmptyChart label="Configure chart data field" />;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    );
  }

  const chartData = (data?.labels || []).map((label, i) => ({
    name: label,
    value: data?.values?.[i] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius="35%"
          outerRadius="65%"
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, idx) => (
            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
        />
        {cfg.show_legend !== false && cfg.showLegend !== false && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: "12px" }}>{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
