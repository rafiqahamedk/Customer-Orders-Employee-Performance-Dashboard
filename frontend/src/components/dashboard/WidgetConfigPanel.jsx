import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { useDashboardStore } from "../../store/useDashboardStore";

// Spec-aligned options
const METRIC_OPTIONS = [
  { value: "total_amount", label: "Total Amount" },
  { value: "unit_price", label: "Unit Price" },
  { value: "quantity", label: "Quantity" },
];
const NUMERIC_METRICS = ["total_amount", "unit_price", "quantity"];

const CHART_X_OPTIONS = [
  { value: "product", label: "Product" },
  { value: "country", label: "Country" },
  { value: "status", label: "Status" },
  { value: "order_date", label: "Order Date" },
  { value: "created_by", label: "Created By" },
  { value: "first_name", label: "First Name" },
];
const CHART_Y_OPTIONS = [
  { value: "total_amount", label: "Total Amount" },
  { value: "unit_price", label: "Unit Price" },
  { value: "quantity", label: "Quantity" },
];
const PIE_DATA_OPTIONS = [
  { value: "product", label: "Product" },
  { value: "country", label: "Country" },
  { value: "status", label: "Status" },
  { value: "created_by", label: "Created By" },
];
const TABLE_COLUMN_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "email", label: "Email" },
  { value: "phone_number", label: "Phone" },
  { value: "street_address", label: "Address" },
  { value: "country", label: "Country" },
  { value: "product", label: "Product" },
  { value: "quantity", label: "Quantity" },
  { value: "unit_price", label: "Unit Price" },
  { value: "total_amount", label: "Total Amount" },
  { value: "status", label: "Status" },
  { value: "created_by", label: "Created By" },
  { value: "order_date", label: "Order Date" },
];
const FILTER_OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
];

const TYPE_LABELS = {
  kpi: "KPI Card", bar: "Bar Chart", bar_chart: "Bar Chart",
  line: "Line Chart", line_chart: "Line Chart",
  area: "Area Chart", area_chart: "Area Chart",
  scatter: "Scatter Plot", scatter_plot: "Scatter Plot",
  pie: "Pie Chart", pie_chart: "Pie Chart",
  table: "Table",
};

export default function WidgetConfigPanel({ widgetId, onClose }) {
  const widget = useDashboardStore((s) => s.widgets.find((w) => w.id === widgetId));
  const updateWidget = useDashboardStore((s) => s.updateWidget);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (widget) {
      setTitle(widget.title || "");
      setDescription(widget.description || "");
      setConfig(widget.config || {});
    }
  }, [widgetId, widget]);

  if (!widget) return null;

  const wType = widget.widget_type || widget.type;
  const isKPI = wType === "kpi";
  const isChart = ["bar", "bar_chart", "line", "line_chart", "area", "area_chart", "scatter", "scatter_plot"].includes(wType);
  const isPie = wType === "pie" || wType === "pie_chart";
  const isTable = wType === "table";

  const commit = (newTitle, newDesc, newConfig) => {
    updateWidget(widgetId, { title: newTitle, description: newDesc, config: newConfig });
  };

  const updateConfig = (key, value) => {
    const next = { ...config, [key]: value };
    setConfig(next);
    commit(title, description, next);
  };

  const handleTitle = (val) => {
    setTitle(val);
    commit(val, description, config);
  };

  const handleDesc = (val) => {
    setDescription(val);
    commit(title, val, config);
  };

  // Table filters
  const filters = config.filters || [];
  const addFilter = () => updateConfig("filters", [...filters, { field: "", operator: "equals", value: "" }]);
  const removeFilter = (idx) => updateConfig("filters", filters.filter((_, i) => i !== idx));
  const updateFilter = (idx, key, val) => {
    const next = [...filters];
    next[idx] = { ...next[idx], [key]: val };
    updateConfig("filters", next);
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-border dark:border-[#1e2535] rounded-lg bg-white dark:bg-[#0f1420] text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const readOnlyCls = inputCls + " opacity-60 cursor-not-allowed";
  const labelCls = "block text-xs font-medium text-muted mb-1";
  const sectionTitleCls = "text-[10px] font-bold text-muted uppercase tracking-widest mb-3";
  const filterInputCls = "flex-1 px-2 py-1.5 text-xs border border-border dark:border-[#1e2535] rounded-lg bg-white dark:bg-[#0f1420] text-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-primary/40";

  return (
    <aside className="w-72 flex-shrink-0 bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl flex flex-col overflow-hidden shadow-panel">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border dark:border-[#1e2535] flex-shrink-0">
        <div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Configure</p>
          <h2 className="text-sm font-bold text-dark dark:text-white mt-0.5">
            {TYPE_LABELS[wType] || wType}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:bg-bg dark:hover:bg-white/10 hover:text-dark dark:hover:text-white transition-all"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

        {/* General */}
        <div>
          <p className={sectionTitleCls}>General</p>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Title</label>
              <input value={title} onChange={(e) => handleTitle(e.target.value)} className={inputCls} placeholder="Untitled" />
            </div>
            <div>
              <label className={labelCls}>Widget type</label>
              <input value={TYPE_LABELS[wType] || wType} readOnly className={readOnlyCls} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                value={description}
                onChange={(e) => handleDesc(e.target.value)}
                className={inputCls + " resize-none"}
                rows={2}
                placeholder="Optional description..."
              />
            </div>
          </div>
        </div>

        {/* KPI Data Settings */}
        {isKPI && (
          <div>
            <p className={sectionTitleCls}>Data Settings</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Metric</label>
                <select value={config.metric || ""} onChange={(e) => updateConfig("metric", e.target.value)} className={inputCls}>
                  <option value="">Select...</option>
                  {METRIC_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Aggregation</label>
                <select value={config.aggregation || "count"} onChange={(e) => updateConfig("aggregation", e.target.value)} className={inputCls}>
                  <option value="sum">Sum</option>
                  <option value="avg">Average</option>
                  <option value="count">Count</option>
                  <option value="min">Min</option>
                  <option value="max">Max</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Data format</label>
                <select value={config.data_format || "number"} onChange={(e) => updateConfig("data_format", e.target.value)} className={inputCls}>
                  <option value="number">Number</option>
                  <option value="currency">Currency ($)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Decimal precision</label>
                <input
                  type="number" min="0" max="4"
                  value={config.decimal_precision ?? 0}
                  onChange={(e) => updateConfig("decimal_precision", Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* Chart Data Settings */}
        {isChart && (
          <div>
            <p className={sectionTitleCls}>Data Settings</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>X-Axis (group by)</label>
                <select value={config.x_axis || ""} onChange={(e) => updateConfig("x_axis", e.target.value)} className={inputCls}>
                  <option value="">Select...</option>
                  {CHART_X_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Y-Axis (metric)</label>
                <select value={config.y_axis || ""} onChange={(e) => updateConfig("y_axis", e.target.value)} className={inputCls}>
                  <option value="">Select...</option>
                  {CHART_Y_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Aggregation</label>
                <select value={config.aggregation || "sum"} onChange={(e) => updateConfig("aggregation", e.target.value)} className={inputCls}>
                  <option value="sum">Sum</option>
                  <option value="avg">Average</option>
                  <option value="count">Count</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Pie Data Settings */}
        {isPie && (
          <div>
            <p className={sectionTitleCls}>Data Settings</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Group by</label>
                <select value={config.chart_data || ""} onChange={(e) => updateConfig("chart_data", e.target.value)} className={inputCls}>
                  <option value="">Select...</option>
                  {PIE_DATA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Aggregation</label>
                <select value={config.aggregation || "count"} onChange={(e) => updateConfig("aggregation", e.target.value)} className={inputCls}>
                  <option value="count">Count</option>
                  <option value="sum">Sum</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-dark dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.show_legend !== false}
                  onChange={(e) => updateConfig("show_legend", e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                Show legend
              </label>
            </div>
          </div>
        )}

        {/* Table Data Settings */}
        {isTable && (
          <div>
            <p className={sectionTitleCls}>Data Settings</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Columns</label>
                <div className="space-y-1.5 max-h-44 overflow-y-auto border border-border dark:border-[#1e2535] rounded-lg p-3">
                  {TABLE_COLUMN_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm text-dark dark:text-white cursor-pointer hover:text-primary transition">
                      <input
                        type="checkbox"
                        checked={(config.columns || []).includes(opt.value)}
                        onChange={(e) => {
                          const cols = config.columns || [];
                          updateConfig("columns", e.target.checked
                            ? [...cols, opt.value]
                            : cols.filter((c) => c !== opt.value));
                        }}
                        className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Sort direction</label>
                <select value={config.sort_dir || "desc"} onChange={(e) => updateConfig("sort_dir", e.target.value)} className={inputCls}>
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Rows per page</label>
                <select value={config.page_size || 10} onChange={(e) => updateConfig("page_size", parseInt(e.target.value))} className={inputCls}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                </select>
              </div>

              {/* Filters */}
              <div>
                <label className="flex items-center gap-2 text-sm text-dark dark:text-white cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={config.apply_filter || false}
                    onChange={(e) => updateConfig("apply_filter", e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  Apply filters
                </label>
                {config.apply_filter && (
                  <div className="space-y-2">
                    {filters.map((filter, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <select value={filter.field} onChange={(e) => updateFilter(idx, "field", e.target.value)} className={filterInputCls}>
                          <option value="">Field...</option>
                          {TABLE_COLUMN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <select value={filter.operator} onChange={(e) => updateFilter(idx, "operator", e.target.value)} className={filterInputCls}>
                          {FILTER_OPERATORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <input value={filter.value} onChange={(e) => updateFilter(idx, "value", e.target.value)} className={filterInputCls} placeholder="Value" />
                        <button onClick={() => removeFilter(idx)} className="p-1 rounded text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addFilter} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition">
                      <Plus size={13} /> Add filter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chart Styling */}
        {isChart && (
          <div>
            <p className={sectionTitleCls}>Styling</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Chart color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.chart_color || "#54bd95"}
                    onChange={(e) => updateConfig("chart_color", e.target.value)}
                    className="w-10 h-9 rounded-lg border border-border cursor-pointer p-0.5"
                  />
                  <input
                    value={config.chart_color || "#54bd95"}
                    onChange={(e) => updateConfig("chart_color", e.target.value)}
                    className={inputCls + " flex-1"}
                    placeholder="#54bd95"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-dark dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.show_data_labels || false}
                  onChange={(e) => updateConfig("show_data_labels", e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                Show data labels
              </label>
            </div>
          </div>
        )}

        {/* Table Styling */}
        {isTable && (
          <div>
            <p className={sectionTitleCls}>Styling</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Font size</label>
                <input
                  type="number" min={12} max={18}
                  value={config.font_size || 14}
                  onChange={(e) => updateConfig("font_size", Math.min(18, Math.max(12, parseInt(e.target.value) || 14)))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Header background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.header_bg || "#54bd95"}
                    onChange={(e) => updateConfig("header_bg", e.target.value)}
                    className="w-10 h-9 rounded-lg border border-border cursor-pointer p-0.5"
                  />
                  <input
                    value={config.header_bg || "#54bd95"}
                    onChange={(e) => updateConfig("header_bg", e.target.value)}
                    className={inputCls + " flex-1"}
                    placeholder="#54bd95"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
