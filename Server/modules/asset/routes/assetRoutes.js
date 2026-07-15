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

// Create Asset
router.post("/", createAsset);

// Get All Assets (with optional ?search=)
router.get("/", getAssets);

// Get Single Asset
router.get("/:id", getAssetById);

// Assign Asset
router.patch("/:id/assign", assignAsset);

// Update Asset
router.put("/:id", updateAsset);

// Delete Asset
router.delete("/:id", deleteAsset);

module.exports = router;