import React, { useState } from "react";
import { Field, Input, Select, Textarea, SectionTitle } from "./FormField";
import { HexColorPicker } from "react-colorful";

const ALL_COLUMNS = [
  { value: "id",          label: "Order ID" },
  { value: "firstName",   label: "First Name" },
  { value: "lastName",    label: "Last Name" },
  { value: "email",       label: "Email" },
  { value: "phoneNumber", label: "Phone Number" },
  { value: "streetAddress", label: "Street Address" },
  { value: "country",     label: "Country" },
  { value: "product",     label: "Product" },
  { value: "quantity",    label: "Quantity" },
  { value: "unitPrice",   label: "Unit Price" },
  { value: "totalAmount", label: "Total Amount" },
  { value: "status",      label: "Status" },
  { value: "orderDate",   label: "Order Date" },
  { value: "createdBy",   label: "Created By" },
];

const DEFAULT_COLS = ["firstName", "product", "quantity", "totalAmount", "status", "orderDate"];

export default function TableConfig({ widget, patch, patchConfig }) {
  const cfg = widget.config || {};
  const [showPicker, setShowPicker] = useState(false);
  const selected = cfg.columns?.length ? cfg.columns : DEFAULT_COLS;

  const toggleCol = (val) => {
    const next = selected.includes(val)
      ? selected.filter((c) => c !== val)
      : [...selected, val];
    // Enforce min 1, max 10
    if (next.length === 0 || next.length > 10) return;
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
        <Field label="Width (cols)" required>
          <Input type="number" min={1} max={12} value={widget.layout.w}
            onChange={(e) => patch({ layout: { ...widget.layout, w: Math.min(12, Math.max(1, +e.target.value)) } })} />
        </Field>
        <Field label="Height (rows)" required>
          <Input type="number" min={2} value={widget.layout.h}
            onChange={(e) => patch({ layout: { ...widget.layout, h: Math.max(2, +e.target.value) } })} />
        </Field>
      </div>

      <SectionTitle>Data Settings</SectionTitle>
      <Field label="Columns (max 10)" required>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto scrollbar-thin bg-bg dark:bg-white/5 rounded-lg p-2 border border-border dark:border-[#1e2535]">
          {ALL_COLUMNS.map((col) => (
            <label key={col.value} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(col.value)}
                onChange={() => toggleCol(col.value)}
                className="w-3.5 h-3.5 accent-primary"
              />
              {col.label}
            </label>
          ))}
        </div>
        <p className="text-[10px] text-muted mt-1">{selected.length} / 10 selected</p>
      </Field>
      <Field label="Sort by">
        <Select value={cfg.sortBy || ""} onChange={(e) => patchConfig({ sortBy: e.target.value })}>
          <option value="">-- None --</option>
          <option value="orderDate">Order Date (newest first)</option>
          <option value="asc">First column A → Z</option>
          <option value="desc">First column Z → A</option>
        </Select>
      </Field>
      <Field label="Rows per page">
        <Select value={cfg.pagination || ""} onChange={(e) => patchConfig({ pagination: e.target.value })}>
          <option value="">All rows</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="25">25</option>
        </Select>
      </Field>
      <Field label="Column search filters">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={!!cfg.applyFilter}
            onChange={(e) => patchConfig({ applyFilter: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          Enable per-column search
        </label>
      </Field>

      <SectionTitle>Styling</SectionTitle>
      <Field label="Font size (10–20)">
        <Input
          type="number" min={10} max={20} value={cfg.fontSize || 14}
          onChange={(e) => patchConfig({ fontSize: Math.min(20, Math.max(10, +e.target.value)) })}
        />
      </Field>
      <Field label="Header color">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-border flex-shrink-0 shadow-sm"
            style={{ background: cfg.headerBg || "#54bd95" }}
            onClick={() => setShowPicker((v) => !v)}
          />
          <Input
            value={cfg.headerBg || "#54bd95"}
            maxLength={7}
            onChange={(e) => patchConfig({ headerBg: e.target.value })}
            placeholder="#54bd95"
          />
        </div>
        {showPicker && (
          <div className="mt-2">
            <HexColorPicker color={cfg.headerBg || "#54bd95"} onChange={(c) => patchConfig({ headerBg: c })} />
          </div>
        )}
      </Field>
    </>
  );
}
