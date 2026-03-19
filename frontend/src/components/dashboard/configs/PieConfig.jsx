import React from "react";
import { Field, Input, Select, Textarea, SectionTitle } from "./FormField";

// Only categorical fields are valid for pie slice grouping
const GROUP_OPTIONS = [
  { value: "product",   label: "Product" },
  { value: "country",   label: "Country" },
  { value: "status",    label: "Status" },
  { value: "createdBy", label: "Created By" },
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
      <Field label="Group slices by" required>
        <Select value={cfg.chartData || ""} onChange={(e) => patchConfig({ chartData: e.target.value })}>
          <option value="">-- Select field --</option>
          {GROUP_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </Field>
      <Field label="Show legend">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={!!cfg.showLegend}
            onChange={(e) => patchConfig({ showLegend: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          Show legend
        </label>
      </Field>
    </>
  );
}
