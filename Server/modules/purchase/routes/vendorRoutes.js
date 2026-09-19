const express = require("express");
const router = express.Router();

const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");

const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;
const purchaseRoles = checkRole(["admin", "purchase"]);

// Create Vendor
router.post("/", protect, purchaseRoles, createVendor);

// Get All Vendors (with optional ?search=)
router.get("/", protect, purchaseRoles, getVendors);

// Get Single Vendor
router.get("/:id", protect, purchaseRoles, getVendorById);

// Update Vendor
router.put("/:id", protect, purchaseRoles, updateVendor);

// Delete Vendor
router.delete("/:id", protect, purchaseRoles, deleteVendor);

module.exports = router;