import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["below_target", "high_performer", "milestone", "email_sent", "performance", "insight"],
    default: "insight",
  },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetRole: { type: String, enum: ["admin", "employee", "all"], default: "all" },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
