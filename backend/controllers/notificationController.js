import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const getNotifications = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? { $or: [{ targetRole: "admin" }, { targetRole: "all" }] }
        : {
            $or: [
              { employeeId: req.user.userId, targetRole: { $in: ["employee", "all"] } },
              { targetRole: "all" },
            ],
          };
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? { $or: [{ targetRole: "admin" }, { targetRole: "all" }] }
        : { employeeId: req.user.userId };
    await Notification.updateMany(filter, { read: true });
    res.json({ message: "Marked all as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markOneRead = async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!n) return res.status(404).json({ message: "Not found" });
    res.json(n);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Called by cron job every 24h — generates admin performance insights
export const generatePerformanceInsights = async () => {
  try {
    const employees = await User.find({ role: "employee" });
    if (!employees.length) return;

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Calculate today's qty sold per employee
    const stats = await Promise.all(
      employees.map(async (emp) => {
        const orders = await Order.find({
          employeeId: emp._id,
          orderDate: { $gte: startOfDay },
        });
        const qty = orders.reduce((s, o) => s + (o.quantity || 0), 0);
        return { emp, qty };
      })
    );

    // Sort by qty descending
    stats.sort((a, b) => b.qty - a.qty);

    const top = stats[0];
    const notifications = [];

    // Top performer notification
    if (top.qty > 0) {
      notifications.push({
        message: `Top performer today: ${top.emp.name} sold ${top.qty} product${top.qty !== 1 ? "s" : ""}.`,
        type: "performance",
        targetRole: "admin",
        employeeId: top.emp._id,
      });
    }

    // Below-target notifications
    for (const { emp, qty } of stats) {
      if (emp.monthlyTarget && qty === 0) {
        notifications.push({
          message: `${emp.name} has no sales recorded today. Monthly target: ${emp.monthlyTarget} units.`,
          type: "below_target",
          targetRole: "admin",
          employeeId: emp._id,
        });
      }
    }

    if (notifications.length) {
      await Notification.insertMany(notifications);
      console.log(`[cron] Generated ${notifications.length} performance insight(s).`);
    }
  } catch (err) {
    console.error("[cron] generatePerformanceInsights error:", err.message);
  }
};
