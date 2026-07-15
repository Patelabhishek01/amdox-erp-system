const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(
      req.body
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
  try {
    const lowStockItems = await Product.find({
      $expr: {
        $lte: ["$stockLevel", "$minThreshold"]
      }
    }).sort({ createdAt: -1 });

    res.status(200).json(lowStockItems);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch low stock items",
      error: error.message,
    });
  }
};

// Adjust stock level
const updateStock = async (req, res) => {
  try {
    const { productId, stockLevel, quantity } = req.body;
    const updateVal = stockLevel !== undefined ? stockLevel : quantity;

    if (updateVal === undefined) {
      return res.status(400).json({ message: "Stock level or quantity is required" });
    }

    const id = productId || req.params.id || req.body.id;
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stockLevel = updateVal;
    product.quantity = updateVal; // Hook handles sync

    await product.save();

    res.status(200).json({
      message: "Stock adjusted successfully",
      product
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to adjust stock",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateStock
};