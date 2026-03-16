import User from "../models/User.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";

export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Calculate total orders and total quantity sold
    const orders = await Order.find({ employeeId: req.params.id });
    const totalOrders = orders.length;
    const totalQty = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);

    res.json({ ...employee.toObject(), totalOrders, totalQty });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).select("-password");
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const setSalesTarget = async (req, res) => {
  try {
    const { monthlyTarget } = req.body;
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { monthlyTarget },
      { new: true }
    ).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Check if below target and create notification
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const orders = await Order.find({ employeeId: req.params.id, orderDate: { $gte: startOfMonth } });
    const totalQty = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
    const pct = monthlyTarget > 0 ? Math.round((totalQty / monthlyTarget) * 100) : 100;

    if (pct < 100) {
      await Notification.create({
        message: `${employee.name} has achieved only ${pct}% of the monthly sales target.`,
        type: "below_target",
        employeeId: employee._id,
      });
    }

    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const sendReminderEmail = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: "Sales Performance Reminder",
      html: `
        <p>Hello ${employee.name},</p>
        <p>Your current sales performance is below the expected monthly target. Please review your progress and focus on increasing sales activity.</p>
        <p>Best regards,<br/>Admin Team</p>
      `,
    });

    await Notification.create({
      message: `Performance reminder email successfully sent to ${employee.name}.`,
      type: "email_sent",
      employeeId: employee._id,
    });

    res.json({ message: `Email sent successfully to ${employee.name}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
