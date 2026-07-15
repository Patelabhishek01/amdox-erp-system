const Asset = require("../models/Asset");
const Employee = require("../../hr/models/employee");

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

// Get All Assets (with search & filtering)
exports.getAssets = async (req, res) => {
  try {
    const { search = "", assignedToEmployeeId } = req.query;
    const filter = {};

    if (assignedToEmployeeId) {
      filter.assignedToEmployeeId = assignedToEmployeeId;
    } else if (search) {
      filter.$or = [
        { assetName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { assignedTo: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const assets = await Asset.find(filter).sort({ createdAt: -1 });

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

// Assign Asset
exports.assignAsset = async (req, res) => {
  try {
    const { assignedToEmployeeId } = req.body;
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (assignedToEmployeeId) {
      const employee = await Employee.findById(assignedToEmployeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      asset.assignedToEmployeeId = assignedToEmployeeId;
      asset.assignedTo = employee.name;
      asset.status = "Assigned";
    } else {
      asset.assignedToEmployeeId = null;
      asset.assignedTo = "";
      asset.status = "Available";
    }

    await asset.save();

    res.json({
      message: "Asset assignment updated successfully",
      asset
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};