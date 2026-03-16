import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Search, ChevronRight, Star, Package,
  DollarSign, CheckCircle, Clock, TrendingUp,
} from "lucide-react";
import { usersApi, ordersApi } from "../utils/api";

function StarRating({ qty }) {
  let stars = 1;
  if (qty > 200) stars = 5;
  else if (qty > 100) stars = 4;
  else if (qty > 50) stars = 3;
  else if (qty > 20) stars = 2;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} className={i <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} />
      ))}
    </div>
  );
}

function MetricBadge({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 bg-bg dark:bg-white/5 rounded-xl px-3 py-2">
      <Icon size={13} className={color} />
      <div>
        <p className="text-[10px] text-muted leading-none">{label}</p>
        <p className="text-xs font-semibold text-dark dark:text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([usersApi.getEmployees(), ordersApi.getAll("all")])
      .then(([emps, ords]) => { setEmployees(emps); setOrders(ords); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getStats = (empId) => {
    const empOrders = orders.filter((o) => String(o.employeeId) === String(empId));
    const totalQty = empOrders.reduce((s, o) => s + (o.quantity || 0), 0);
    const totalRevenue = empOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const completed = empOrders.filter((o) => o.status === "Completed").length;
    const pending = empOrders.filter((o) => o.status === "Pending").length;
    return { totalOrders: empOrders.length, totalQty, totalRevenue, completed, pending };
  };

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Employees</h1>
          <p className="text-sm text-muted mt-0.5">{employees.length} team member{employees.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="pl-9 pr-4 py-2 text-sm rounded-xl border border-border dark:border-[#1e2535] bg-white dark:bg-[#161b27] text-dark dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 w-56"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-border dark:bg-[#1e2535] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[360px] bg-white dark:bg-[#161b27] rounded-2xl border border-border dark:border-[#1e2535] gap-3">
          <Users size={32} className="text-muted/40" />
          <p className="text-muted text-sm">No employees found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((emp) => {
            const stats = getStats(emp._id);
            const now = new Date();
            const monthOrders = orders.filter((o) => {
              const d = new Date(o.orderDate);
              return String(o.employeeId) === String(emp._id) &&
                d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
            const monthQty = monthOrders.reduce((s, o) => s + (o.quantity || 0), 0);
            const targetPct = emp.monthlyTarget ? Math.min(100, Math.round((monthQty / emp.monthlyTarget) * 100)) : 0;

            return (
              <div
                key={emp._id}
                className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-5 shadow-card hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Employee Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-xl">{emp.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-dark dark:text-white">{emp.name}</p>
                      <p className="text-xs text-muted">{emp.email}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <StarRating qty={stats.totalQty} />
                        <span className="text-[10px] capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{emp.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="flex flex-wrap gap-2">
                    <MetricBadge icon={Package} label="Total Products Sold" value={stats.totalQty} color="text-primary" />
                    <MetricBadge icon={DollarSign} label="Revenue Generated" value={`$${stats.totalRevenue.toLocaleString()}`} color="text-purple-500" />
                    <MetricBadge icon={CheckCircle} label="Completed Orders" value={stats.completed} color="text-green-500" />
                    <MetricBadge icon={Clock} label="Pending Orders" value={stats.pending} color="text-orange-500" />
                  </div>

                  {/* View button */}
                  <button
                    onClick={() => navigate(`/employees/${emp._id}`)}
                    className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 hover:bg-primary hover:text-white px-3 py-2 rounded-xl transition-all font-medium self-start"
                  >
                    View Details <ChevronRight size={13} />
                  </button>
                </div>

                {/* Monthly target progress */}
                <div className="mt-4 pt-4 border-t border-border dark:border-[#1e2535]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted flex items-center gap-1"><TrendingUp size={11} /> Monthly Target Progress</span>
                    <span className="font-semibold text-dark dark:text-white">{monthQty} / {emp.monthlyTarget || 150} units — {targetPct}%</span>
                  </div>
                  <div className="h-1.5 bg-bg dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${targetPct >= 100 ? "bg-green-500" : targetPct >= 60 ? "bg-primary" : "bg-red-400"}`}
                      style={{ width: `${targetPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
