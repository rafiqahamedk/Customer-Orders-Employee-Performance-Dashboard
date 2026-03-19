import React, { useState } from "react";
import { Field, Input, Select, Textarea, SectionTitle } from "./FormField";
import { HexColorPicker } from "react-colorful";

const TYPE_LABELS = {
  bar: "Bar Chart", line: "Line Chart", area: "Area Chart", scatter: "Scatter Plot",
};

// Categorical / dimension fields valid for X-axis grouping
const X_AXIS_OPTIONS = [
  { value: "product",    label: "Product" },
  { value: "country",    label: "Country" },
  { value: "status",     label: "Status" },
  { value: "orderDate",  label: "Order Date (by month)" },
  { value: "createdBy",  label: "Created By" },
  { value: "firstName",  label: "First Name" },
];

// Numeric fields valid for Y-axis measure
const Y_AXIS_OPTIONS = [
  { value: "totalAmount", label: "Total Amount" },
  { value: "quantity",    label: "Quantity" },
  { value: "unitPrice",   label: "Unit Price" },
];

export default function ChartConfig({ widget, patch, patchConfig }) {
  const cfg = widget.config || {};
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <Field label="Widget title" required>
        <Input value={widget.title} onChange={(e) => patch({ title: e.target.value })} />
      </Field>
      <Field label="Widget type">
        <Input value={TYPE_LABELS[widget.type] || widget.type} readOnly />
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
      <Field label="X-Axis (dimension)" required>
        <Select value={cfg.xAxis || ""} onChange={(e) => patchConfig({ xAxis: e.target.value })}>
          <option value="">-- Select --</option>
          {X_AXIS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </Field>
      <Field label="Y-Axis (measure)" required>
        <Select value={cfg.yAxis || ""} onChange={(e) => patchConfig({ yAxis: e.target.value })}>
          <option value="">-- Select --</option>
          {Y_AXIS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </Field>

      <SectionTitle>Styling</SectionTitle>
      <Field label="Chart color">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-border flex-shrink-0 shadow-sm"
            style={{ background: cfg.color || "#54bd95" }}
            onClick={() => setShowPicker((v) => !v)}
          />
          <Input
            value={cfg.color || "#54bd95"}
            maxLength={7}
            onChange={(e) => patchConfig({ color: e.target.value })}
            placeholder="#54bd95"
          />
        </div>
        {showPicker && (
          <div className="mt-2">
            <HexColorPicker color={cfg.color || "#54bd95"} onChange={(c) => patchConfig({ color: c })} />
          </div>
        )}
      </Field>
      <Field label="Show data labels">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={!!cfg.showDataLabel}
            onChange={(e) => patchConfig({ showDataLabel: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          Show values on chart
        </label>
      </Field>
    </>
  );
}
