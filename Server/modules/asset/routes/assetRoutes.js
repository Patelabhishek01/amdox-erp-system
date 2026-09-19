const express = require("express");
const router = express.Router();

const {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  assignAsset,
} = require("../controllers/assetController");

const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;
const assetRoles = checkRole(["admin", "asset"]);

// Create Asset
router.post("/", protect, assetRoles, createAsset);

// Get All Assets (with optional ?search=)
router.get("/", protect, assetRoles, getAssets);

// Get Single Asset
router.get("/:id", protect, assetRoles, getAssetById);

// Assign Asset
router.patch("/:id/assign", protect, assetRoles, assignAsset);

// Update Asset
router.put("/:id", protect, assetRoles, updateAsset);

// Delete Asset
router.delete("/:id", protect, assetRoles, deleteAsset);

module.exports = router;