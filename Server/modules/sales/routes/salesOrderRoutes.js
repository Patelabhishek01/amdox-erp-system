const express = require("express");
const router = express.Router();
const {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder
} = require("../controllers/salesOrderController");
const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;
const salesRoles = checkRole(["admin", "sales"]);

router.post("/", protect, salesRoles, createSalesOrder);
router.get("/", protect, salesRoles, getSalesOrders);
router.get("/:id", protect, salesRoles, getSalesOrderById);
router.put("/:id", protect, salesRoles, updateSalesOrder);

module.exports = router;
