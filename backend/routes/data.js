import express from "express";
import { aggregateData, tableData } from "../controllers/dataController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/aggregate", protect, aggregateData);
router.get("/table", protect, tableData);

export default router;
