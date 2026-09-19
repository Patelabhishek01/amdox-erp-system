const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

// Admin / System Metrics
router.get("/metrics", authMiddleware, dashboardController.getAdminDashboardMetrics);

module.exports = router;
