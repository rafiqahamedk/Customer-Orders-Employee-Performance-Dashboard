import Order from "../models/Order.js";

// Helper: build date filter from date_range param
function buildDateFilter(dateRange) {
  const now = new Date();
  switch (dateRange) {
    case "today": {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      return { orderDate: { $gte: start } };
    }
    case "last_7": {
      const start = new Date(now); start.setDate(now.getDate() - 7);
      return { orderDate: { $gte: start } };
    }
    case "last_30": {
      const start = new Date(now); start.setDate(now.getDate() - 30);
      return { orderDate: { $gte: start } };
    }
    case "last_90": {
      const start = new Date(now); start.setDate(now.getDate() - 90);
      return { orderDate: { $gte: start } };
    }
    default:
      return {};
  }
}

// Map spec field names to mongoose field names
const FIELD_MAP = {
  id: "_id",
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  phone_number: "phone",
  street_address: "street",
  country: "country",
  product: "product",
  quantity: "quantity",
  unit_price: "unitPrice",
  total_amount: "totalAmount",
  status: "status",
  created_by: "createdBy",
  order_date: "orderDate",
};

// GET /api/data/aggregate?metric=total_amount&aggregation=sum&group_by=product&date_range=all
export const aggregateData = async (req, res) => {
  try {
    const { metric, aggregation = "count", group_by, date_range = "all" } = req.query;
    const dateFilter = buildDateFilter(date_range);

    const mongoField = FIELD_MAP[metric] || metric;
    const groupField = FIELD_MAP[group_by] || group_by;

    if (!group_by) {
      // Single aggregate value (for KPI)
      const orders = await Order.find(dateFilter);
      let total = 0;
      if (aggregation === "count") {
        total = orders.length;
      } else {
        const values = orders.map((o) => parseFloat(o[mongoField] ?? 0)).filter((v) => !isNaN(v));
        if (values.length) {
          if (aggregation === "sum") total = values.reduce((a, b) => a + b, 0);
          else if (aggregation === "avg") total = values.reduce((a, b) => a + b, 0) / values.length;
          else if (aggregation === "min") total = Math.min(...values);
          else if (aggregation === "max") total = Math.max(...values);
        }
      }
      return res.json({ total });
    }

    // Grouped aggregate (for charts)
    const groupExpr =
      group_by === "order_date"
        ? { $dateToString: { format: "%Y-%m", date: "$orderDate" } }
        : `$${groupField}`;

    let accumulatorExpr;
    if (aggregation === "count") {
      accumulatorExpr = { $sum: 1 };
    } else if (aggregation === "sum") {
      accumulatorExpr = { $sum: `$${mongoField}` };
    } else if (aggregation === "avg") {
      accumulatorExpr = { $avg: `$${mongoField}` };
    } else if (aggregation === "min") {
      accumulatorExpr = { $min: `$${mongoField}` };
    } else if (aggregation === "max") {
      accumulatorExpr = { $max: `$${mongoField}` };
    } else {
      accumulatorExpr = { $sum: 1 };
    }

    const pipeline = [
      { $match: dateFilter },
      { $group: { _id: groupExpr, value: accumulatorExpr } },
      { $sort: { _id: 1 } },
    ];

    const results = await Order.aggregate(pipeline);
    const labels = results.map((r) => r._id ?? "Unknown");
    const values = results.map((r) => r.value ?? 0);

    res.json({ labels, values });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/data/table?columns=id,first_name,product&sort_by=order_date&sort_dir=desc&page=1&page_size=10&date_range=all
export const tableData = async (req, res) => {
  try {
    const {
      columns = "id,first_name,product,total_amount,status,order_date",
      sort_by = "order_date",
      sort_dir = "desc",
      page = 1,
      page_size = 10,
      date_range = "all",
      filters,
    } = req.query;

    const dateFilter = buildDateFilter(date_range);
    const colList = columns.split(",").map((c) => c.trim());
    const mongoSortField = FIELD_MAP[sort_by] || sort_by;
    const sortObj = { [mongoSortField]: sort_dir === "asc" ? 1 : -1 };

    // Build filter query
    let filterQuery = { ...dateFilter };
    if (filters) {
      try {
        const parsedFilters = JSON.parse(filters);
        parsedFilters.forEach(({ field, operator, value }) => {
          if (!field || !value) return;
          const mf = FIELD_MAP[field] || field;
          if (operator === "equals") filterQuery[mf] = value;
          else if (operator === "not_equals") filterQuery[mf] = { $ne: value };
          else if (operator === "contains") filterQuery[mf] = { $regex: value, $options: "i" };
          else if (operator === "greater_than") filterQuery[mf] = { $gt: parseFloat(value) || value };
          else if (operator === "less_than") filterQuery[mf] = { $lt: parseFloat(value) || value };
        });
      } catch (_) {}
    }

    const total = await Order.countDocuments(filterQuery);
    const skip = (parseInt(page) - 1) * parseInt(page_size);
    const orders = await Order.find(filterQuery).sort(sortObj).skip(skip).limit(parseInt(page_size));

    // Map to spec field names
    const REVERSE_MAP = Object.fromEntries(Object.entries(FIELD_MAP).map(([k, v]) => [v, k]));
    const rows = orders.map((o) => {
      const row = {};
      colList.forEach((col) => {
        const mf = FIELD_MAP[col] || col;
        let val = o[mf];
        if (col === "id") val = o._id?.toString();
        if (col === "street_address") val = `${o.street || ""}, ${o.city || ""}, ${o.state || ""}`;
        row[col] = val ?? "";
      });
      return row;
    });

    res.json({ rows, total, page: parseInt(page), page_size: parseInt(page_size) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
