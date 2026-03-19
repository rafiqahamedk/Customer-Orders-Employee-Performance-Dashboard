import React from "react";
import { Field, Input, Select, Textarea, SectionTitle } from "./FormField";

// Only numeric fields are valid KPI metrics per the steering spec
const METRICS = [
  { value: "totalAmount", label: "Total Amount" },
  { value: "unitPrice",   label: "Unit Price" },
  { value: "quantity",    label: "Quantity" },
];

export default function KpiConfig({ widget, patch, patchConfig }) {
  const cfg = widget.config || {};

  return (
    <>
      <Field label="Widget title" required>
        <Input value={widget.title} onChange={(e) => patch({ title: e.target.value })} />
      </Field>
      <Field label="Widget type">
        <Input value="KPI Card" readOnly />
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
      <Field label="Metric" required>
        <Select value={cfg.metric || ""} onChange={(e) => patchConfig({ metric: e.target.value, aggregation: "" })}>
          <option value="">-- Select metric --</option>
          {METRICS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </Select>
      </Field>
      <Field label="Aggregation" required>
        <Select
          value={cfg.aggregation || ""}
          disabled={!cfg.metric}
          onChange={(e) => patchConfig({ aggregation: e.target.value })}
        >
          <option value="">-- Select --</option>
          <option value="sum">Sum</option>
          <option value="avg">Average</option>
          <option value="count">Count</option>
          <option value="min">Min</option>
          <option value="max">Max</option>
        </Select>
      </Field>
      <Field label="Data format">
        <Select value={cfg.dataFormat || "number"} onChange={(e) => patchConfig({ dataFormat: e.target.value })}>
          <option value="number">Number</option>
          <option value="currency">Currency ($)</option>
        </Select>
      </Field>
      <Field label="Decimal places">
        <Input type="number" min={0} max={4} value={cfg.decimalPrecision ?? 0}
          onChange={(e) => patchConfig({ decimalPrecision: Math.min(4, Math.max(0, +e.target.value)) })} />
      </Field>
    </>
  );
}
