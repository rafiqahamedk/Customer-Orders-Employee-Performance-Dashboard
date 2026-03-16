import React, { useEffect, useState } from "react";
import { ShoppingCart, DollarSign, Clock, TrendingUp } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

function KpiCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-dark dark:text-white">{value}</p>
      <p className="text-xs text-muted mt-0.5">{label}</p>
      {sub && <p className="text-xs text-primary mt-1">{sub}</p>}
    </div>
  );
}

const COLORS = ["#54bd95", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"];

const STATUS_COLORS = { Completed: "#54bd95", "In progress": "#6366f1", Pending: "#f59e0b" };

export default function EmployeeDashboardPage() {
  const { orders, fetchOrders } = useOrderStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchOrders("all"); }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pending = orders.filter((o) => o.status === "Pending").length;
  const completed = orders.filter((o) => o.status === "Completed").length;

  // Orders by status for pie
  const statusData = Object.entries(
    orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  // Revenue by product for bar
  const productRevenue = Object.entries(
    orders.reduce((acc, o) => {
      const key = o.product?.replace("Fiber Internet ", "FI ").replace("5G Unlimited Mobile Plan", "5G Plan").replace("Business Internet ", "BI ").replace("VoIP Corporate Package", "VoIP");
      acc[key] = (acc[key] || 0) + (o.totalAmount || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Orders over time (last 7 days)
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const count = orders.filter((o) => {
      const od = new Date(o.orderDate);
      return od.toDateString() === d.toDateString();
    }).length;
    return { name: label, orders: count };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-dark dark:text-white">My Dashboard</h1>
        <p className="text-sm text-muted mt-0.5">Welcome back, {user?.name}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={ShoppingCart} label="Total Orders" value={orders.length} color="bg-primary" />
        <KpiCard icon={DollarSign} label="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}k`} color="bg-purple-500" />
        <KpiCard icon={Clock} label="Pending Orders" value={pending} color="bg-orange-500" />
        <KpiCard icon={TrendingUp} label="Completed" value={completed} color="bg-green-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders trend */}
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-sm text-dark dark:text-white mb-4">Orders (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e9f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e9f0", fontSize: 12 }} />
              <Line type="monotone" dataKey="orders" stroke="#54bd95" strokeWidth={2.5} dot={{ r: 4, fill: "#54bd95" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status pie */}
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-sm text-dark dark:text-white mb-4">Orders by Status</h3>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-muted text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e9f0", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue by product */}
      <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-5 shadow-card">
        <h3 className="font-semibold text-sm text-dark dark:text-white mb-4">Revenue by Product</h3>
        {productRevenue.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-muted text-sm">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={productRevenue} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e9f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e9f0", fontSize: 12 }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="value" fill="#54bd95" radius={[6, 6, 0, 0]}>
                {productRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border dark:border-[#1e2535]">
          <h3 className="font-semibold text-sm text-dark dark:text-white">My Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted text-sm">No orders yet</div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-bg dark:bg-white/5 text-muted">
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-right px-4 py-3 font-medium">Qty</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((o) => (
                  <tr key={o._id} className="border-t border-border dark:border-[#1e2535] hover:bg-bg dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 font-medium text-dark dark:text-white">{o.firstName} {o.lastName}</td>
                    <td className="px-4 py-3 text-muted max-w-[160px] truncate">{o.product}</td>
                    <td className="px-4 py-3 text-right text-dark dark:text-white">{o.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium text-dark dark:text-white">${o.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                        ${o.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" :
                          o.status === "In progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" :
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{new Date(o.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
