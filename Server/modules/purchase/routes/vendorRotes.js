const express = require("express");
const router = express.Router();

const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");

// Create Vendor
router.post("/", createVendor);

// Get All Vendors (with optional ?search=)
router.get("/", getVendors);

// Get Single Vendor
router.get("/:id", getVendorById);

// Update Vendor
router.put("/:id", updateVendor);

// Delete Vendor
router.delete("/:id", deleteVendor);

module.exports = router;