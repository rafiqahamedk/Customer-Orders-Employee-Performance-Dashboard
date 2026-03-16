import express from "express";
import { protect } from "../middleware/auth.js";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();
router.use(protect);
router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
