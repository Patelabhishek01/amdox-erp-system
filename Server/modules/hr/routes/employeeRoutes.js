const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const {
  authMiddleware,
  adminMiddleware
} = require("../../../middleware/authMiddleware");

// Create Employee (Admin only)
router.post(
  "/employees",
  authMiddleware,
  adminMiddleware,
  createEmployee
);

// Get All Employees
router.get(
  "/employees",
  authMiddleware,
  getEmployees
);

// Get Single Employee
router.get(
  "/employees/:id",
  authMiddleware,
  getEmployeeById
);

// Update Employee (Admin only)
router.put(
  "/employees/:id",
  authMiddleware,
  adminMiddleware,
  updateEmployee
);

// Delete Employee (Admin only)
router.delete(
  "/employees/:id",
  authMiddleware,
  adminMiddleware,
  deleteEmployee
);

module.exports = router;