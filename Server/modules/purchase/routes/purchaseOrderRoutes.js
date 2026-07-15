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

// Create Purchase Order
router.post("/", createPurchaseOrder);

// Get All Purchase Orders (with optional ?search=)
router.get("/", getPurchaseOrders);

// Get Single Purchase Order
router.get("/:id", getPurchaseOrderById);

// Receive Purchase Order (Mark items received, add to stock, log transaction)
router.put("/:id/receive", receivePurchaseOrder);

// Update Purchase Order
router.put("/:id", updatePurchaseOrder);

// Delete Purchase Order
router.delete("/:id", deletePurchaseOrder);

module.exports = router;