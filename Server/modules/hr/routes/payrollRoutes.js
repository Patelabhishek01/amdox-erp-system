const express = require("express");
const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  updatePayrollStatus,
  deletePayroll,
} = require("../controllers/payrollController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../../../middleware/authMiddleware");

// Create Payroll
router.post(
  "/payrolls",
  authMiddleware,
  adminMiddleware,
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
  adminMiddleware,
  updatePayrollStatus
);

// Delete Payroll
router.delete(
  "/payrolls/:id",
  authMiddleware,
  adminMiddleware,
  deletePayroll
);

module.exports = router;