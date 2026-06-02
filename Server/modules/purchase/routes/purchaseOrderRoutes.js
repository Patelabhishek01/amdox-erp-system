const express = require("express");
const router = express.Router();

const {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
} = require("../controllers/purchaseOrderController");

// Create Purchase Order
router.post("/", createPurchaseOrder);

// Get All Purchase Orders (with optional ?search=)
router.get("/", getPurchaseOrders);

// Get Single Purchase Order
router.get("/:id", getPurchaseOrderById);

// Update Purchase Order
router.put("/:id", updatePurchaseOrder);

// Delete Purchase Order
router.delete("/:id", deletePurchaseOrder);

module.exports = router;