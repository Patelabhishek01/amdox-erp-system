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
  adminMiddleware,
  checkRole
} = require("../../../middleware/authMiddleware");

// Create Employee (Admin & HR)
router.post(
  "/employees",
  authMiddleware,
  checkRole(["admin", "hr"]),
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