import { useState, useEffect } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import api from "../utils/api";

// Thin axios wrapper that returns data directly
async function fetchAggregate(params) {
  const res = await api.get("/data/aggregate", { params });
  return res.data;
}

async function fetchTable(params) {
  const res = await api.get("/data/table", { params });
  return res.data;
}

export function useWidgetData(widget) {
  const dateFilter = useDashboardStore((s) => s.dateFilter);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { type, widget_type, config } = widget || {};
  const wType = widget_type || type; // support both naming conventions

  useEffect(() => {
    if (!wType) return;

    let cancelled = false;
    setIsLoading(true);

    const load = async () => {
      try {
        let result = null;

        if (wType === "table") {
          const cols = config?.columns?.join(",") ||
            "id,first_name,product,quantity,total_amount,status,order_date";
          const params = {
            columns: cols,
            sort_by: config?.sort_by || "order_date",
            sort_dir: config?.sort_dir || "desc",
            page: config?.page || 1,
            page_size: config?.page_size || 10,
            date_range: dateFilter,
          };
          if (config?.filters?.length) {
            params.filters = JSON.stringify(config.filters);
          }
          result = await fetchTable(params);
        } else {
          // KPI / charts
          const metric =
            config?.metric || config?.y_axis || config?.metrics?.[0] || "total_amount";
          const groupBy =
            config?.group_by || config?.x_axis || config?.chart_data || config?.dataKey;

          const params = {
            metric,
            aggregation: config?.aggregation || "count",
            date_range: dateFilter,
          };
          if (groupBy) params.group_by = groupBy;
          result = await fetchAggregate(params);
        }

        if (!cancelled) setData(result);
      } catch (err) {
        console.error("useWidgetData error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [wType, JSON.stringify(config), dateFilter]);

  return { data, isLoading };
}
