import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cron from "node-cron";

import orderRoutes from "./routes/orders.js";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import notificationRoutes from "./routes/notifications.js";
import { generatePerformanceInsights } from "./controllers/notificationController.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.json({ status: "Halleyx API running" }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Run performance insights every 24h at midnight
    cron.schedule("0 0 * * *", () => {
      console.log("[cron] Running daily performance insights...");
      generatePerformanceInsights();
    });

    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
