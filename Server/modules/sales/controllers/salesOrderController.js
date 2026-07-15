const SalesOrder = require("../models/SalesOrder");
const Product = require("../../inventory/models/Product");
const Transaction = require("../../finance/models/Transaction");
const Notification = require("../../../models/Notification");

// Create Sales Order
const createSalesOrder = async (req, res) => {
  try {
    const { customerId, items, paymentStatus } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided in order" });
    }

    // 1. Calculate total amount and check stock levels
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      const currentStock = product.stockLevel !== undefined ? product.stockLevel : (product.quantity || 0);
      if (currentStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}. Available: ${currentStock}` });
      }
      totalAmount += item.price * item.quantity;
    }

    // 2. Create the Sales Order
    const salesOrder = new SalesOrder({
      customerId,
      items,
      totalAmount,
      paymentStatus: paymentStatus || "Unpaid"
    });

    await salesOrder.save();

    // 3. Deduct stock quantities and check low stock threshold
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      const currentStock = product.stockLevel !== undefined ? product.stockLevel : (product.quantity || 0);
      const newStock = currentStock - item.quantity;
      product.stockLevel = newStock;
      product.quantity = newStock; // backward compatibility
      
      await product.save();

      // Trigger low-stock alert if below minThreshold (or reorderLevel)
      const threshold = product.minThreshold !== undefined ? product.minThreshold : (product.reorderLevel !== undefined ? product.reorderLevel : 10);
      if (newStock <= threshold) {
        const message = `SKU-${product.sku} requires reordering.`;
        
        // Create Notification
        const notification = new Notification({
          department: "Purchase",
          title: "Low Stock Alert",
          message,
          type: "warning"
        });
        await notification.save();

        // Socket IO Real-time emit
        const io = req.app.get("io");
        if (io) {
          io.to("Purchase").emit("notification", notification);
          io.emit("notification", notification); // general broadcast
        }
      }
    }

    // 4. Log to Finance ledger if Paid
    if (salesOrder.paymentStatus === "Paid") {
      try {
        await Transaction.create({
          sourceModule: "Sales",
          type: "Credit",
          amount: totalAmount,
          referenceId: salesOrder._id,
          date: Date.now()
        });
      } catch (finError) {
        console.error("Failed to automatically record sales order payment in Finance:", finError);
      }
    }

    res.status(201).json({
      message: "Sales Order created successfully",
      salesOrder
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Sales Orders
const getSalesOrders = async (req, res) => {
  try {
    const orders = await SalesOrder.find()
      .populate("customerId")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Single Sales Order
const getSalesOrderById = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id)
      .populate("customerId")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Sales Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Sales Order (e.g. paymentStatus)
const updateSalesOrder = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await SalesOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Sales Order not found" });
    }

    const oldPaymentStatus = order.paymentStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    // If payment status changed to Paid, log to Finance module
    if (order.paymentStatus === "Paid" && oldPaymentStatus !== "Paid") {
      try {
        await Transaction.create({
          sourceModule: "Sales",
          type: "Credit",
          amount: order.totalAmount,
          referenceId: order._id,
          date: Date.now()
        });
      } catch (finError) {
        console.error("Failed to automatically record sales order payment in Finance:", finError);
      }
    }

    res.json({ message: "Sales Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder
};
