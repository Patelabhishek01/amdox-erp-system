const express = require("express");
const router = express.Router();
const {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder
} = require("../controllers/salesOrderController");
const { authMiddleware } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;

router.post("/", protect, createSalesOrder);
router.get("/", protect, getSalesOrders);
router.get("/:id", protect, getSalesOrderById);
router.put("/:id", protect, updateSalesOrder);

module.exports = router;
