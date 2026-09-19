const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getDashboardMetrics
} = require("../controllers/transactionController");
const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;
const financeRoles = checkRole(["admin", "finance"]);

router.post("/transactions", protect, financeRoles, createTransaction);
router.get("/dashboard-metrics", protect, financeRoles, getDashboardMetrics);

module.exports = router;
