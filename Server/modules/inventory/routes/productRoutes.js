const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Import auth middleware
const {authMiddleware} = require("../../../middleware/authMiddleware");

// Support both export styles:
// module.exports = protect
// OR
// module.exports = { protect }
const protect =
  authMiddleware.protect || authMiddleware;

// GET all products
router.get("/", protect, getProducts);

// CREATE product
router.post("/", protect, createProduct);

// GET single product
router.get("/:id", protect, getProductById);

// UPDATE product
router.put("/:id", protect, updateProduct);

// DELETE product
router.delete("/:id", protect, deleteProduct);

module.exports = router;