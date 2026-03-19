/**
 * Maps a widget field key to the actual value from an order object.
 * Field names match the steering spec and the Order mongoose model.
 */
export function getFieldValue(order, field) {
  switch (field) {
    case "id":             return order._id || "";
    case "firstName":      return order.firstName || "";
    case "lastName":       return order.lastName || "";
    case "email":          return order.email || "";
    case "phone":
    case "phoneNumber":    return order.phone || "";
    case "streetAddress":
    case "address":        return `${order.street || ""}, ${order.city || ""}, ${order.state || ""}`;
    case "country":        return order.country || "";
    case "product":        return order.product || "";
    case "quantity":       return order.quantity ?? 0;
    case "unitPrice":      return order.unitPrice ?? 0;
    case "totalAmount":    return order.totalAmount ?? 0;
    case "status":         return order.status || "";
    case "createdBy":      return order.createdBy || "";
    case "orderDate":      return order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "";
    // legacy aliases kept for backward compat with saved dashboards
    case "customerId":     return order._id || "";
    case "customerName":   return `${order.firstName || ""} ${order.lastName || ""}`.trim();
    case "orderId":        return order._id || "";
    case "phone":          return order.phone || "";
    default:               return "";
  }
}

/** Returns the raw orderDate as a Date object for grouping */
function getOrderDate(order) {
  return order.orderDate ? new Date(order.orderDate) : null;
}

/**
 * Aggregate a numeric field across all orders.
 * Supports: sum | avg | average | count | min | max
 */
export function aggregate(orders, field, method) {
  if (!field || !method) return 0;
  if (method === "count") return orders.length;

  const values = orders
    .map((o) => parseFloat(getFieldValue(o, field)))
    .filter((v) => !isNaN(v));

  if (!values.length) return 0;

  switch (method) {
    case "sum":     return values.reduce((a, b) => a + b, 0);
    case "avg":
    case "average": return values.reduce((a, b) => a + b, 0) / values.length;
    case "min":     return Math.min(...values);
    case "max":     return Math.max(...values);
    default:        return 0;
  }
}

/**
 * Group orders by a categorical field for pie charts.
 * Returns [{ name, value }] sorted by value desc.
 */
export function groupBy(orders, field) {
  const map = {};
  orders.forEach((o) => {
    const key = String(getFieldValue(o, field) || "Unknown");
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Build chart data from x/y axis config.
 * - xAxis: categorical or date field (groups rows)
 * - yAxis: numeric field (summed per group)
 * If yAxis is non-numeric, falls back to count.
 */
export function buildChartData(orders, xAxis, yAxis) {
  const NUMERIC = ["quantity", "unitPrice", "totalAmount"];
  const isNumericY = NUMERIC.includes(yAxis);

  const grouped = {};

  orders.forEach((o) => {
    let x;
    if (xAxis === "orderDate") {
      const d = getOrderDate(o);
      x = d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` : "Unknown";
    } else {
      x = String(getFieldValue(o, xAxis) || "Unknown");
    }

    if (!grouped[x]) grouped[x] = { name: x, sum: 0, count: 0 };
    grouped[x].count += 1;

    if (isNumericY) {
      const y = parseFloat(getFieldValue(o, yAxis));
      if (!isNaN(y)) grouped[x].sum += y;
    }
  });

  return Object.values(grouped)
    .map((d) => ({ name: d.name, value: isNumericY ? d.sum : d.count }))
    .sort((a, b) => {
      // Keep date strings sorted chronologically
      if (xAxis === "orderDate") return a.name.localeCompare(b.name);
      return 0;
    });
}

/**
 * Format a numeric value for display.
 * format: "currency" | "number"
 * precision: decimal places (default 0)
 */
export function formatValue(value, format, precision) {
  const n = parseFloat(value);
  if (isNaN(n)) return "0";
  const fixed = n.toFixed(precision ?? 0);
  const localized = parseFloat(fixed).toLocaleString(undefined, {
    minimumFractionDigits: precision ?? 0,
    maximumFractionDigits: precision ?? 0,
  });
  return format === "currency" ? `$${localized}` : localized;
}
