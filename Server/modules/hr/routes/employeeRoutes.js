const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getEmployees,
  getMyEmployeeProfile,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const {
  authMiddleware,
  adminMiddleware,
  checkRole
} = require("../../../middleware/authMiddleware");

const hrRoles = checkRole(["admin", "hr"]);
const projectAndHrRoles = checkRole(["admin", "hr", "project", "project manager"]);

// Create Employee (Admin & HR)
router.post(
  "/employees",
  authMiddleware,
  hrRoles,
  createEmployee
);

// Get All Employees (Admin, HR & Project Managers for assignment)
router.get(
  "/employees",
  authMiddleware,
  projectAndHrRoles,
  getEmployees
);

// Get Logged-in Employee Profile
router.get(
  "/employees/me",
  authMiddleware,
  getMyEmployeeProfile
);

// Get Single Employee
router.get(
  "/employees/:id",
  authMiddleware,
  hrRoles,
  getEmployeeById
);

// Update Employee (Admin & HR)
router.put(
  "/employees/:id",
  authMiddleware,
  hrRoles,
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