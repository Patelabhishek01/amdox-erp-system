const Asset = require("../models/Asset");

// Create Asset
exports.createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create asset",
      error: error.message,
    });
  }
};

// Get All Assets (with search)
exports.getAssets = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const assets = await Asset.find({
      $or: [
        { assetName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { assignedTo: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assets",
      error: error.message,
    });
  }
};

// Get Single Asset
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch asset",
      error: error.message,
    });
  }
};

// Update Asset
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json(asset);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update asset",
      error: error.message,
    });
  }
};

// Delete Asset
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json({
      message: "Asset deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete asset",
      error: error.message,
    });
  }
};