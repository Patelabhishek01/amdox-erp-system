const Vendor = require("../models/Vendors");

// Create Vendor
exports.createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create vendor",
      error: error.message,
    });
  }
};

// Get All Vendors (with search)
exports.getVendors = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const vendors = await Vendor.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vendors",
      error: error.message,
    });
  }
};

// Get Single Vendor
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vendor",
      error: error.message,
    });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update vendor",
      error: error.message,
    });
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete vendor",
      error: error.message,
    });
  }
};