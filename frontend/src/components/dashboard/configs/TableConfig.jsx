import React, { useState } from "react";
import { Field, Input, Select, Textarea, SectionTitle } from "./FormField";
import { HexColorPicker } from "react-colorful";

const ALL_COLUMNS = [
  { value: "customerId", label: "Customer ID" },
  { value: "customerName", label: "Customer name" },
  { value: "email", label: "Email id" },
  { value: "phone", label: "Phone number" },
  { value: "address", label: "Address" },
  { value: "orderId", label: "Order ID" },
  { value: "orderDate", label: "Order date" },
  { value: "product", label: "Product" },
  { value: "quantity", label: "Quantity" },
  { value: "unitPrice", label: "Unit price" },
  { value: "totalAmount", label: "Total amount" },
  { value: "status", label: "Status" },
  { value: "createdBy", label: "Created by" },
];

export default function TableConfig({ widget, patch, patchConfig }) {
  const cfg = widget.config || {};
  const [showPicker, setShowPicker] = useState(false);
  const selected = cfg.columns || [];

  const toggleCol = (val) => {
    const next = selected.includes(val) ? selected.filter((c) => c !== val) : [...selected, val];
    patchConfig({ columns: next });
  };

  return (
    <>
      <Field label="Widget title" required>
        <Input value={widget.title} onChange={(e) => patch({ title: e.target.value })} />
      </Field>
      <Field label="Widget type">
        <Input value="Table" readOnly />
      </Field>
      <Field label="Description">
        <Textarea value={widget.description || ""} onChange={(e) => patch({ description: e.target.value })} />
      </Field>
      <SectionTitle>Widget Size</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Width (Columns)" required>
          <Input type="number" min={1} value={widget.layout.w}
            onChange={(e) => patch({ layout: { ...widget.layout, w: Math.max(1, +e.target.value) } })} />
        </Field>
        <Field label="Height (Rows)" required>
          <Input type="number" min={1} value={widget.layout.h}
            onChange={(e) => patch({ layout: { ...widget.layout, h: Math.max(1, +e.target.value) } })} />
        </Field>
      </div>
      <SectionTitle>Data Settings</SectionTitle>
      <Field label="Choose columns" required>
        <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto scrollbar-thin bg-bg rounded-lg p-2 border border-border">
          {ALL_COLUMNS.map((col) => (
            <label key={col.value} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
              <input type="checkbox" checked={selected.includes(col.value)} onChange={() => toggleCol(col.value)}
                className="w-3.5 h-3.5 accent-primary" />
              {col.label}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Sort by">
        <Select value={cfg.sortBy || ""} onChange={(e) => patchConfig({ sortBy: e.target.value })}>
          <option value="">-- None --</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
          <option value="orderDate">Order date</option>
        </Select>
      </Field>
      <Field label="Pagination">
        <Select value={cfg.pagination || ""} onChange={(e) => patchConfig({ pagination: e.target.value })}>
          <option value="">-- None --</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </Select>
      </Field>
      <Field label="Apply filter">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={!!cfg.applyFilter}
            onChange={(e) => patchConfig({ applyFilter: e.target.checked })}
            className="w-4 h-4 accent-primary" />
          Enable column filters
        </label>
      </Field>
      <SectionTitle>Styling</SectionTitle>
      <Field label="Font size">
        <Input type="number" min={12} max={18} value={cfg.fontSize || 14}
          onChange={(e) => patchConfig({ fontSize: Math.min(18, Math.max(12, +e.target.value)) })} />
      </Field>
      <Field label="Header background">
        <div className="flex items-center gap-2">
          <button type="button" className="w-8 h-8 rounded-lg border border-border flex-shrink-0 shadow-sm"
            style={{ background: cfg.headerBg || "#54bd95" }} onClick={() => setShowPicker(!showPicker)} />
          <Input value={cfg.headerBg || "#54bd95"} maxLength={7}
            onChange={(e) => patchConfig({ headerBg: e.target.value })} placeholder="#54bd95" />
        </div>
        {showPicker && <div className="mt-2"><HexColorPicker color={cfg.headerBg || "#54bd95"} onChange={(c) => patchConfig({ headerBg: c })} /></div>}
      </Field>
    </>
  );
}
