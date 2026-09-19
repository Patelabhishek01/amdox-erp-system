const express = require("express");
const router = express.Router();

const {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
  receivePurchaseOrder,
} = require("../controllers/purchaseOrderController");

const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;
const purchaseRoles = checkRole(["admin", "purchase"]);

// Create Purchase Order
router.post("/", protect, purchaseRoles, createPurchaseOrder);

// Get All Purchase Orders (with optional ?search=)
router.get("/", protect, purchaseRoles, getPurchaseOrders);

// Get Single Purchase Order
router.get("/:id", protect, purchaseRoles, getPurchaseOrderById);

// Receive Purchase Order (Mark items received, add to stock, log transaction)
router.put("/:id/receive", protect, purchaseRoles, receivePurchaseOrder);

// Update Purchase Order
router.put("/:id", protect, purchaseRoles, updatePurchaseOrder);

// Delete Purchase Order
router.delete("/:id", protect, purchaseRoles, deletePurchaseOrder);

module.exports = router;