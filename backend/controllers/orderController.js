import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const getOrders = async (req, res) => {
  try {
    const { dateFilter } = req.query;
    let query = {};

    // Employees only see their own orders
    if (req.user?.role === "employee") {
      query.employeeId = req.user.userId;
    }

    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      const daysMap = { today: 0, "7days": 7, "30days": 30, "90days": 90 };
      const days = daysMap[dateFilter];
      const from = new Date(now);
      if (days === 0) from.setHours(0, 0, 0, 0);
      else from.setDate(from.getDate() - days);
      query.orderDate = { $gte: from };
    }

    const orders = await Order.find(query).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const data = {
      ...req.body,
      employeeId: req.user?.userId,
      createdBy: req.user?.name || req.body.createdBy,
    };
    const order = await new Order(data).save();

    // Check monthly target after new order
    if (req.user?.role === "employee") {
      const employee = await User.findById(req.user.userId);
      if (employee?.monthlyTarget) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const orders = await Order.find({ employeeId: req.user.userId, orderDate: { $gte: startOfMonth } });
        const totalQty = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
        const pct = Math.round((totalQty / employee.monthlyTarget) * 100);

        if (totalQty >= employee.monthlyTarget) {
          await Notification.create({
            message: `${employee.name} achieved the monthly sales milestone of ${employee.monthlyTarget} products!`,
            type: "milestone",
            employeeId: employee._id,
          });
        } else if (pct >= 80) {
          await Notification.create({
            message: `${employee.name} is at ${pct}% of the monthly sales target. Keep going!`,
            type: "insight",
            employeeId: employee._id,
          });
        }
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.role === "employee") filter.employeeId = req.user.userId;
    const updated = await Order.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.role === "employee") filter.employeeId = req.user.userId;
    const deleted = await Order.findOneAndDelete(filter);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
