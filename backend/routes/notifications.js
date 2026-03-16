import express from "express";
import { protect } from "../middleware/auth.js";
import { getNotifications, markRead, markOneRead } from "../controllers/notificationController.js";

const router = express.Router();
router.use(protect);
router.get("/", getNotifications);
router.put("/read-all", markRead);
router.put("/:id/read", markOneRead);

export default router;
