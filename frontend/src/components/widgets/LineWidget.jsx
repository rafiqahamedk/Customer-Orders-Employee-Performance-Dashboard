import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from "recharts";
import { buildChartData } from "../../utils/dataHelpers";
import EmptyChart from "./EmptyChart";

export default function LineWidget({ widget, orders }) {
  const cfg = widget.config || {};
  if (!cfg.xAxis || !cfg.yAxis) return <EmptyChart label="Configure X & Y axis" />;
  const data = buildChartData(orders, cfg.xAxis, cfg.yAxis);
  const color = cfg.color || "#54bd95";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 4 }}>
          {cfg.showDataLabel && <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} />}
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}
