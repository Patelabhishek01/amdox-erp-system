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
const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");

const protect = authMiddleware.protect || authMiddleware;
const salesRoles = checkRole(["admin", "sales", "crm"]);

// GET all customers
router.get("/", protect, salesRoles, getCustomers);

// CREATE customer
router.post("/", protect, salesRoles, createCustomer);

// GET one customer
router.get("/:id", protect, salesRoles, getCustomerById);

// UPDATE customer
router.put("/:id", protect, salesRoles, updateCustomer);

// DELETE customer
router.delete("/:id", protect, salesRoles, deleteCustomer);

module.exports = router;