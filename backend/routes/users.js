import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  setSalesTarget,
  sendReminderEmail,
} from "../controllers/userController.js";

const router = express.Router();
router.use(protect);
router.get("/", adminOnly, getEmployees);
router.get("/:id", adminOnly, getEmployeeById);
router.put("/:id", adminOnly, updateEmployee);
router.put("/:id/target", adminOnly, setSalesTarget);
router.post("/:id/remind", adminOnly, sendReminderEmail);

export default router;
