import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const STATUS_STYLES = {
  "Pending": "bg-amber-50 text-amber-700 border border-amber-200",
  "In progress": "bg-blue-50 text-blue-700 border border-blue-200",
  "Completed": "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function OrderTable({ orders, onEdit, onDelete }) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg border-b border-border">
              {["Customer","Email","Product","Qty","Unit Price","Total","Status","Created By","Order Date","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-muted uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-border/50 last:border-0 hover:bg-bg/60 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-dark whitespace-nowrap">{o.firstName} {o.lastName}</td>
                <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">{o.email}</td>
                <td className="px-4 py-3 text-sm text-dark whitespace-nowrap">{o.product}</td>
                <td className="px-4 py-3 text-sm text-dark text-center">{o.quantity}</td>
                <td className="px-4 py-3 text-sm text-dark whitespace-nowrap">${o.unitPrice?.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-semibold text-dark whitespace-nowrap">${o.totalAmount?.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_STYLES[o.status] || ""}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">{o.createdBy}</td>
                <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                  {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onEdit(o)}
                      className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => onDelete(o)}
                      className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
