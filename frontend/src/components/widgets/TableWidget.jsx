import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWidgetData } from "../../hooks/useWidgetData";

const COL_LABELS = {
  id: "ID", first_name: "First Name", last_name: "Last Name",
  email: "Email", phone_number: "Phone", street_address: "Address",
  country: "Country", product: "Product", quantity: "Qty",
  unit_price: "Unit Price", total_amount: "Total", status: "Status",
  created_by: "Created By", order_date: "Order Date",
};

function formatCell(col, value) {
  if (col === "id") return value ? String(value).slice(0, 8) + "..." : "";
  if (col === "total_amount" || col === "unit_price") {
    const n = parseFloat(value) || 0;
    return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (col === "order_date" && value) {
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  if (col === "status") {
    const colors = {
      Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      "In progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[value] || ""}`}>
        {value}
      </span>
    );
  }
  return value ?? "";
}

export default function TableWidget({ widget }) {
  const cfg = widget.config || {};
  const [page, setPage] = useState(1);

  const widgetWithPage = { ...widget, config: { ...cfg, page } };
  const { data, isLoading } = useWidgetData(widgetWithPage);

  const headerBg = cfg.header_bg || cfg.headerBg || "#54bd95";
  const fontSize = cfg.font_size || cfg.fontSize || 14;
  const pageSize = cfg.page_size || cfg.pageSize || 10;
  const columns = cfg.columns || ["id", "first_name", "product", "total_amount", "status", "order_date"];

  if (isLoading) {
    return (
      <div className="h-full p-3 space-y-2">
        <div className="w-full h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ))}
      </div>
    );
  }

  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="h-full flex flex-col p-2 overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse" style={{ fontSize: `${fontSize}px` }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ backgroundColor: headerBg }}
                >
                  {COL_LABELS[col] || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-sm text-muted">
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border dark:border-[#1e2535] hover:bg-bg dark:hover:bg-white/5 transition"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-2 whitespace-nowrap text-dark dark:text-white/80">
                      {formatCell(col, row[col])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-border dark:border-[#1e2535]">
          <span className="text-xs text-muted">
            Page {page} of {totalPages} ({total} records)
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1 rounded disabled:opacity-30 hover:bg-bg dark:hover:bg-white/10 text-muted transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1 rounded disabled:opacity-30 hover:bg-bg dark:hover:bg-white/10 text-muted transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
