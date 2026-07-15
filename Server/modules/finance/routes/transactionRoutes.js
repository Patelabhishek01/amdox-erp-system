const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getDashboardMetrics
} = require("../controllers/transactionController");
const { authMiddleware } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;

router.post("/transactions", protect, createTransaction);
router.get("/dashboard-metrics", protect, getDashboardMetrics);

module.exports = router;
