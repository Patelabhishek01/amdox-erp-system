const express = require("express");
const router = express.Router();

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

// Auth middleware
const {authMiddleware} = require("../../../middleware/authMiddleware");

// Support both:
// module.exports = protect
// OR
// module.exports = { protect }
const protect =
  authMiddleware.protect || authMiddleware;

// GET all customers
router.get("/", protect, getCustomers);

// CREATE customer
router.post("/", protect, createCustomer);

// GET one customer
router.get("/:id", protect, getCustomerById);

// UPDATE customer
router.put("/:id", protect, updateCustomer);

// DELETE customer
router.delete("/:id", protect, deleteCustomer);

module.exports = router;