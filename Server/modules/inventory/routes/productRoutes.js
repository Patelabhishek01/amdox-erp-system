const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateStock,
} = require("../controllers/productController");

// Import auth middleware
const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");

const protect = authMiddleware.protect || authMiddleware;
const inventoryRoles = checkRole(["admin", "inventory"]);

// GET low-stock products
router.get("/low-stock", protect, inventoryRoles, getLowStockProducts);

// PATCH update-stock
router.patch("/update-stock", protect, inventoryRoles, updateStock);

// GET all products
router.get("/", protect, inventoryRoles, getProducts);

// CREATE product
router.post("/", protect, inventoryRoles, createProduct);

// GET single product
router.get("/:id", protect, inventoryRoles, getProductById);

// UPDATE product
router.put("/:id", protect, inventoryRoles, updateProduct);

// DELETE product
router.delete("/:id", protect, inventoryRoles, deleteProduct);

module.exports = router;