import express from "express";
import { protect } from "../middleware/auth.js";
import { getDashboard, saveDashboard } from "../controllers/dashboardController.js";

const router = express.Router();
router.use(protect);
router.get("/", getDashboard);
router.post("/", saveDashboard);

export default router;
