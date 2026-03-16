import React from "react";
import { Field, Input, Select, Textarea, SectionTitle } from "./FormField";

const DATA_OPTIONS = [
  { value: "product", label: "Product" },
  { value: "quantity", label: "Quantity" },
  { value: "unitPrice", label: "Unit price" },
  { value: "totalAmount", label: "Total amount" },
  { value: "status", label: "Status" },
  { value: "createdBy", label: "Created by" },
];

export default function PieConfig({ widget, patch, patchConfig }) {
  const cfg = widget.config || {};
  return (
    <>
      <Field label="Widget title" required>
        <Input value={widget.title} onChange={(e) => patch({ title: e.target.value })} />
      </Field>
      <Field label="Widget type">
        <Input value="Pie Chart" readOnly />
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
      <Field label="Chart data" required>
        <Select value={cfg.chartData || ""} onChange={(e) => patchConfig({ chartData: e.target.value })}>
          <option value="">-- Select --</option>
          {DATA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </Field>
      <Field label="Show legend">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={!!cfg.showLegend}
            onChange={(e) => patchConfig({ showLegend: e.target.checked })}
            className="w-4 h-4 accent-primary" />
          Show legend
        </label>
      </Field>
    </>
  );
}
