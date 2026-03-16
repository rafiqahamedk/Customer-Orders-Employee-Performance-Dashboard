import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { groupBy } from "../../utils/dataHelpers";
import EmptyChart from "./EmptyChart";

const COLORS = ["#54bd95", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export default function PieWidget({ widget, orders }) {
  const cfg = widget.config || {};
  if (!cfg.chartData) return <EmptyChart label="Configure chart data" />;
  const data = groupBy(orders, cfg.chartData);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%" label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        {cfg.showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );
}
