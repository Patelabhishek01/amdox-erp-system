const express = require("express");
const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  updatePayrollStatus,
  deletePayroll,
  processPayroll,
} = require("../controllers/payrollController");

const {
  authMiddleware,
  checkRole,
} = require("../../../middleware/authMiddleware");

const hrRoles = checkRole(["admin", "hr"]);

// Process Bulk Payroll (Logs wage expenses Debit in Finance module)
router.post(
  "/payroll/process",
  authMiddleware,
  hrRoles,
  processPayroll
);

// Create Payroll
router.post(
  "/payrolls",
  authMiddleware,
  hrRoles,
  createPayroll
);

// Get All Payrolls
router.get(
  "/payrolls",
  authMiddleware,
  getPayrolls
);

// Update Payroll Status
router.put(
  "/payrolls/:id",
  authMiddleware,
  hrRoles,
  updatePayrollStatus
);

// Delete Payroll
router.delete(
  "/payrolls/:id",
  authMiddleware,
  hrRoles,
  deletePayroll
);

module.exports = router;