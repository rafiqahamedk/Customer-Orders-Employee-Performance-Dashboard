import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, Mail, Calendar, Briefcase, Target,
  TrendingUp, Package, CheckCircle, Clock, Send,
} from "lucide-react";
import { usersApi, ordersApi } from "../utils/api";

function StarRating({ qty }) {
  let stars = 1;
  if (qty > 200) stars = 5;
  else if (qty > 100) stars = 4;
  else if (qty > 50) stars = 3;
  else if (qty > 20) stars = 2;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={18} className={i <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} />
      ))}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border dark:border-[#1e2535] last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs font-medium text-dark dark:text-white">{value || "—"}</span>
    </div>
  );
}

const STATUS_STYLE = {
  Completed: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  "In progress": "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
};

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetInput, setTargetInput] = useState("");
  const [targetMsg, setTargetMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    Promise.all([usersApi.getEmployee(id), ordersApi.getAll("all")])
      .then(([emp, allOrders]) => {
        setEmployee(emp);
        setTargetInput(emp.monthlyTarget || 150);
        setOrders(allOrders.filter((o) => o.employeeId === id || String(o.employeeId) === id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const totalQty = orders.reduce((s, o) => s + (o.quantity || 0), 0);
  const thisMonthOrders = orders.filter((o) => {
    const d = new Date(o.orderDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthQty = thisMonthOrders.reduce((s, o) => s + (o.quantity || 0), 0);
  const targetPct = employee?.monthlyTarget ? Math.min(100, Math.round((thisMonthQty / employee.monthlyTarget) * 100)) : 0;

  const handleSetTarget = async () => {
    try {
      const updated = await usersApi.setTarget(id, Number(targetInput));
      setEmployee(updated);
      setTargetMsg("Target updated successfully.");
      setTimeout(() => setTargetMsg(""), 3000);
    } catch {
      setTargetMsg("Failed to update target.");
    }
  };

  const handleSendEmail = async () => {
    setEmailLoading(true);
    try {
      const res = await usersApi.sendReminder(id);
      setEmailMsg(res.message);
      setTimeout(() => setEmailMsg(""), 4000);
    } catch {
      setEmailMsg("Failed to send email. Check email config.");
    }
    setEmailLoading(false);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!employee) return (
    <div className="text-center py-20 text-muted">Employee not found.</div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/employees")} className="p-2 rounded-xl border border-border dark:border-[#1e2535] text-muted hover:bg-bg dark:hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">{employee.name}</h1>
          <p className="text-sm text-muted capitalize">{employee.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info Card */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Employee Info */}
          <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border dark:border-[#1e2535]">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-2xl">{employee.name[0]}</span>
              </div>
              <div>
                <p className="font-bold text-dark dark:text-white">{employee.name}</p>
                <p className="text-xs text-muted capitalize">{employee.role}</p>
                <div className="mt-1.5"><StarRating qty={totalQty} /></div>
              </div>
            </div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Employee Information</h3>
            <InfoRow label="Email" value={employee.email} />
            <InfoRow label="Age" value={employee.age} />
            <InfoRow label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
            <InfoRow label="Date of Joining" value={formatDate(employee.dateOfJoining)} />
            <InfoRow label="Experience" value={employee.experienceYears ? `${employee.experienceYears} Years` : null} />
            <InfoRow label="Experience Type" value={employee.experienceType} />
            <InfoRow label="Total Orders" value={orders.length} />
          </div>

          {/* Sales Target */}
          <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-primary" />
              <h3 className="font-semibold text-sm text-dark dark:text-white">Monthly Sales Target</h3>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted">Progress</span>
                <span className="font-semibold text-dark dark:text-white">{thisMonthQty} / {employee.monthlyTarget} units</span>
              </div>
              <div className="h-2 bg-bg dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${targetPct >= 100 ? "bg-green-500" : targetPct >= 60 ? "bg-primary" : "bg-red-400"}`}
                  style={{ width: `${targetPct}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-1">{targetPct}% achieved this month</p>
            </div>
            <div className="flex gap-2 mt-3">
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-border dark:border-[#1e2535] bg-bg dark:bg-white/5 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Set target"
              />
              <button onClick={handleSetTarget} className="px-3 py-2 bg-primary hover:bg-primary-dark text-white text-sm rounded-xl font-medium transition-colors">
                Set
              </button>
            </div>
            {targetMsg && <p className="text-xs text-primary mt-2">{targetMsg}</p>}

            {targetPct < 100 && (
              <div className="mt-4 pt-4 border-t border-border dark:border-[#1e2535]">
                <p className="text-xs text-muted mb-2">Performance is below target. Send a reminder?</p>
                <button
                  onClick={handleSendEmail}
                  disabled={emailLoading}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm py-2 rounded-xl font-medium transition-colors"
                >
                  <Send size={13} />
                  {emailLoading ? "Sending..." : "Send Performance Reminder Email"}
                </button>
                {emailMsg && <p className="text-xs text-green-500 mt-2 text-center">{emailMsg}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Right: Orders Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-[#1e2535]">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-primary" />
                <h3 className="font-semibold text-sm text-dark dark:text-white">Orders ({orders.length})</h3>
              </div>
              <div className="flex gap-3 text-xs text-muted">
                <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> {orders.filter((o) => o.status === "Completed").length} done</span>
                <span className="flex items-center gap-1"><Clock size={12} className="text-yellow-500" /> {orders.filter((o) => o.status === "Pending").length} pending</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <Package size={28} className="text-muted/40" />
                  <p className="text-sm text-muted">No orders yet</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-bg dark:bg-white/5 text-muted">
                      <th className="text-left px-4 py-3 font-medium">Customer</th>
                      <th className="text-left px-4 py-3 font-medium">Product</th>
                      <th className="text-right px-4 py-3 font-medium">Qty</th>
                      <th className="text-right px-4 py-3 font-medium">Amount</th>
                      <th className="text-center px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-t border-border dark:border-[#1e2535] hover:bg-bg dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-dark dark:text-white font-medium">{o.firstName} {o.lastName}</td>
                        <td className="px-4 py-3 text-muted max-w-[160px] truncate">{o.product}</td>
                        <td className="px-4 py-3 text-right text-dark dark:text-white">{o.quantity}</td>
                        <td className="px-4 py-3 text-right text-dark dark:text-white font-medium">${o.totalAmount?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLE[o.status] || ""}`}>{o.status}</span>
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
      </div>
    </div>
  );
}
