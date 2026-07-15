const PurchaseOrder = require("../models/PurchaseOrder");
const Product = require("../../inventory/models/Product");
const Transaction = require("../../finance/models/Transaction");

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

// Receive Purchase Order
exports.receivePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({
        message: "Purchase order not found",
      });
    }

    if (purchaseOrder.status === "Received") {
      return res.status(400).json({
        message: "Purchase order has already been received",
      });
    }

    // 1. Mark as Received
    purchaseOrder.status = "Received";
    await purchaseOrder.save();

    // 2. Loop through items and add back to inventory stock
    if (purchaseOrder.items && purchaseOrder.items.length > 0) {
      for (const item of purchaseOrder.items) {
        let product;
        if (item.productId) {
          product = await Product.findById(item.productId);
        } else {
          // fallback search by name
          product = await Product.findOne({ name: item.productName });
        }

        if (product) {
          const currentStock = product.stockLevel !== undefined ? product.stockLevel : (product.quantity || 0);
          const newStock = currentStock + item.quantity;
          product.stockLevel = newStock;
          product.quantity = newStock; // triggers sync hook
          await product.save();
        }
      }
    }

    // 3. Log Accounts Payable Debit transaction in Finance
    try {
      await Transaction.create({
        sourceModule: "Purchase",
        type: "Debit",
        amount: purchaseOrder.totalAmount,
        referenceId: purchaseOrder._id,
        date: Date.now()
      });
    } catch (finError) {
      console.error("Failed to automatically record received purchase order bill in Finance:", finError);
    }

    res.status(200).json({
      message: "Purchase order marked as Received. Inventory updated and ledger expense recorded.",
      purchaseOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to receive purchase order",
      error: error.message,
    });
  }
};