import express from "express";
import { getDashboard, saveDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", getDashboard);
router.post("/", saveDashboard);

export default router;
