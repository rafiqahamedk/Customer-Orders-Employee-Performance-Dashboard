// Map order fields to display values
export function getFieldValue(order, field) {
  const map = {
    customerId: order._id,
    customerName: `${order.firstName} ${order.lastName}`,
    email: order.email,
    phone: order.phone,
    address: `${order.street}, ${order.city}, ${order.state}`,
    orderId: order._id,
    orderDate: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "",
    product: order.product,
    quantity: order.quantity,
    unitPrice: order.unitPrice,
    totalAmount: order.totalAmount,
    status: order.status,
    createdBy: order.createdBy,
    duration: order.orderDate ? Math.floor((Date.now() - new Date(order.orderDate)) / 86400000) : 0,
  };
  return map[field] ?? "";
}

// Aggregate numeric values
export function aggregate(orders, field, method) {
  const values = orders.map((o) => parseFloat(getFieldValue(o, field))).filter((v) => !isNaN(v));
  if (!values.length) return 0;
  if (method === "sum") return values.reduce((a, b) => a + b, 0);
  if (method === "average") return values.reduce((a, b) => a + b, 0) / values.length;
  if (method === "count") return values.length;
  return 0;
}

// Group orders by a field for charts
export function groupBy(orders, field) {
  const map = {};
  orders.forEach((o) => {
    const key = String(getFieldValue(o, field) || "Unknown");
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// Build chart data from x/y axis config
export function buildChartData(orders, xAxis, yAxis) {
  const grouped = {};
  orders.forEach((o) => {
    const x = String(getFieldValue(o, xAxis) || "Unknown");
    const y = parseFloat(getFieldValue(o, yAxis));
    if (!grouped[x]) grouped[x] = { name: x, value: 0, count: 0 };
    if (!isNaN(y)) { grouped[x].value += y; grouped[x].count += 1; }
    else grouped[x].count += 1;
  });
  return Object.values(grouped).map((d) => ({ name: d.name, value: isNaN(d.value / d.count) ? d.count : d.value }));
}

export function formatValue(value, format, precision) {
  const num = parseFloat(value).toFixed(precision ?? 0);
  if (format === "currency") return `$${parseFloat(num).toLocaleString()}`;
  return parseFloat(num).toLocaleString();
}
