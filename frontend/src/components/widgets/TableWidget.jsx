import React, { useState } from "react";
import { getFieldValue } from "../../utils/dataHelpers";
import { ChevronLeft, ChevronRight } from "lucide-react";

const COL_LABELS = {
  customerId: "Customer ID", customerName: "Customer", email: "Email",
  phone: "Phone", address: "Address", orderId: "Order ID",
  orderDate: "Order Date", product: "Product", quantity: "Qty",
  unitPrice: "Unit Price", totalAmount: "Total", status: "Status", createdBy: "Created By",
};

export default function TableWidget({ widget, orders }) {
  const cfg = widget.config || {};
  const cols = cfg.columns?.length ? cfg.columns : ["customerName", "product", "status", "totalAmount"];
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({});

  const pageSize = cfg.pagination ? parseInt(cfg.pagination) : null;
  const fontSize = cfg.fontSize || 14;
  const headerBg = cfg.headerBg || "#54bd95";

  let data = [...orders];
  if (cfg.applyFilter) {
    Object.entries(filters).forEach(([col, val]) => {
      if (val) data = data.filter((o) => String(getFieldValue(o, col)).toLowerCase().includes(val.toLowerCase()));
    });
  }
  if (cfg.sortBy === "asc") data.sort((a, b) => String(getFieldValue(a, cols[0])).localeCompare(String(getFieldValue(b, cols[0]))));
  if (cfg.sortBy === "desc") data.sort((a, b) => String(getFieldValue(b, cols[0])).localeCompare(String(getFieldValue(a, cols[0]))));
  if (cfg.sortBy === "orderDate") data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const totalPages = pageSize ? Math.ceil(data.length / pageSize) : 1;
  const visible = pageSize ? data.slice(page * pageSize, (page + 1) * pageSize) : data;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontSize }}>
      {cfg.applyFilter && (
        <div className="flex gap-1.5 p-2 border-b border-border flex-wrap">
          {cols.map((col) => (
            <input key={col} placeholder={COL_LABELS[col] || col}
              value={filters[col] || ""}
              onChange={(e) => { setFilters((f) => ({ ...f, [col]: e.target.value })); setPage(0); }}
              className="flex-1 min-w-[80px] px-2 py-1 text-xs border border-border rounded-lg outline-none focus:border-primary bg-bg" />
          ))}
        </div>
      )}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {cols.map((col) => (
                <th key={col} className="px-3 py-2.5 text-left text-xs font-semibold text-white whitespace-nowrap sticky top-0"
                  style={{ background: headerBg }}>
                  {COL_LABELS[col] || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={cols.length} className="text-center py-8 text-muted text-sm">No data</td></tr>
            ) : (
              visible.map((o) => (
                <tr key={o._id} className="hover:bg-bg transition-colors border-b border-border/50 last:border-0">
                  {cols.map((col) => <td key={col} className="px-3 py-2.5 whitespace-nowrap text-dark/80">{String(getFieldValue(o, col))}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pageSize && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 p-2 border-t border-border text-xs text-muted">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}
            className="w-6 h-6 rounded-lg border border-border flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-all">
            <ChevronLeft size={12} />
          </button>
          <span>{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
            className="w-6 h-6 rounded-lg border border-border flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-all">
            <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
