import React from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis } from "recharts";
import { getFieldValue } from "../../utils/dataHelpers";
import EmptyChart from "./EmptyChart";

export default function ScatterWidget({ widget, orders }) {
  const cfg = widget.config || {};
  if (!cfg.xAxis || !cfg.yAxis) return <EmptyChart label="Configure X & Y axis" />;
  const color = cfg.color || "#54bd95";

  const data = orders.map((o) => ({
    x: parseFloat(getFieldValue(o, cfg.xAxis)) || 0,
    y: parseFloat(getFieldValue(o, cfg.yAxis)) || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="x" name={cfg.xAxis} tick={{ fontSize: 11 }} />
        <YAxis dataKey="y" name={cfg.yAxis} tick={{ fontSize: 11 }} />
        <ZAxis range={[40, 40]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill={color} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
