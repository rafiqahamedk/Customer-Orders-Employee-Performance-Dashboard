import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from "recharts";
import { buildChartData } from "../../utils/dataHelpers";
import EmptyChart from "./EmptyChart";

export default function AreaWidget({ widget, orders }) {
  const cfg = widget.config || {};
  if (!cfg.xAxis || !cfg.yAxis) return <EmptyChart label="Configure X & Y axis" />;
  const data = buildChartData(orders, cfg.xAxis, cfg.yAxis);
  const color = cfg.color || "#54bd95";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
        <defs>
          <linearGradient id={`grad-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke={color} fill={`url(#grad-${widget.id})`} strokeWidth={2}>
          {cfg.showDataLabel && <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} />}
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}
