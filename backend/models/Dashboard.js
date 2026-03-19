import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["bar", "line", "pie", "area", "scatter", "table", "kpi"],
  },
  title: { type: String, default: "Untitled" },
  description: { type: String, default: "" },
  layout: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    w: { type: Number, default: 4 },
    h: { type: Number, default: 4 },
  },
  config: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const dashboardSchema = new mongoose.Schema(
  {
    // null = global admin dashboard, ObjectId = per-user dashboard
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    widgets: [widgetSchema],
    dateFilter: {
      type: String,
      enum: ["all", "today", "7days", "30days", "90days"],
      default: "all",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dashboard", dashboardSchema);
