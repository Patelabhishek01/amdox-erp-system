const PurchaseOrder = require("../models/PurchaseOrder");

// Create Purchase Order
exports.createPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.create(req.body);
    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create purchase order",
      error: error.message,
    });
  }
};

// Get All Purchase Orders (with search)
exports.getPurchaseOrders = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const purchaseOrders = await PurchaseOrder.find({
      orderNumber: { $regex: search, $options: "i" },
    })
      .populate("vendor")
      .sort({ createdAt: -1 });

    res.status(200).json(purchaseOrders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchase orders",
      error: error.message,
    });
  }
};

// Get Single Purchase Order
exports.getPurchaseOrderById = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id).populate(
      "vendor"
    );

    if (!purchaseOrder) {
      return res.status(404).json({
        message: "Purchase order not found",
      });
    }

    res.status(200).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchase order",
      error: error.message,
    });
  }
};

// Update Purchase Order
exports.updatePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("vendor");

    if (!purchaseOrder) {
      return res.status(404).json({
        message: "Purchase order not found",
      });
    }

    res.status(200).json(purchaseOrder);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update purchase order",
      error: error.message,
    });
  }
};

// Delete Purchase Order
exports.deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({
        message: "Purchase order not found",
      });
    }

    res.status(200).json({
      message: "Purchase order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete purchase order",
      error: error.message,
    });
  }
};