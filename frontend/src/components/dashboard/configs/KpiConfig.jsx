import React from "react";
import { Field, Input, Select, Textarea, SectionTitle } from "./FormField";

const NUMERIC_METRICS = ["quantity", "unitPrice", "totalAmount"];
const METRICS = [
  { value: "customerId", label: "Customer ID" },
  { value: "customerName", label: "Customer name" },
  { value: "email", label: "Email id" },
  { value: "address", label: "Address" },
  { value: "orderDate", label: "Order date" },
  { value: "product", label: "Product" },
  { value: "createdBy", label: "Created by" },
  { value: "status", label: "Status" },
  { value: "totalAmount", label: "Total amount" },
  { value: "unitPrice", label: "Unit price" },
  { value: "quantity", label: "Quantity" },
];

export default function KpiConfig({ widget, patch, patchConfig }) {
  const cfg = widget.config || {};
  const isNumeric = NUMERIC_METRICS.includes(cfg.metric);

  return (
    <>
      <Field label="Widget title" required>
        <Input value={widget.title} onChange={(e) => patch({ title: e.target.value })} />
      </Field>
      <Field label="Widget type">
        <Input value="KPI" readOnly />
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
      <Field label="Select metric" required>
        <Select value={cfg.metric || ""} onChange={(e) => patchConfig({ metric: e.target.value, aggregation: "" })}>
          <option value="">-- Select --</option>
          {METRICS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </Select>
      </Field>
      <Field label="Aggregation" required>
        <Select value={cfg.aggregation || ""} disabled={!isNumeric}
          onChange={(e) => patchConfig({ aggregation: e.target.value })}>
          <option value="">-- Select --</option>
          <option value="sum">Sum</option>
          <option value="average">Average</option>
          <option value="count">Count</option>
        </Select>
      </Field>
      <Field label="Data format" required>
        <Select value={cfg.dataFormat || "number"} onChange={(e) => patchConfig({ dataFormat: e.target.value })}>
          <option value="number">Number</option>
          <option value="currency">Currency</option>
        </Select>
      </Field>
      <Field label="Decimal Precision" required>
        <Input type="number" min={0} value={cfg.decimalPrecision ?? 0}
          onChange={(e) => patchConfig({ decimalPrecision: Math.max(0, +e.target.value) })} />
      </Field>
    </>
  );
}
