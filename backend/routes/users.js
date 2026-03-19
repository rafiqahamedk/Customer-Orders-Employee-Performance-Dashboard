import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  setSalesTarget,
  sendReminderEmail,
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

const router = express.Router();
router.use(protect);

// Employee self-profile routes (must come before /:id)
router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

// Admin-only routes
router.get("/", adminOnly, getEmployees);
router.get("/:id", adminOnly, getEmployeeById);
router.put("/:id", adminOnly, updateEmployee);
router.put("/:id/target", adminOnly, setSalesTarget);
router.post("/:id/remind", adminOnly, sendReminderEmail);

export default router;
