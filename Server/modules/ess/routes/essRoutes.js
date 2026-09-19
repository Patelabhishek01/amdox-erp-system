const express = require("express");
const router = express.Router();
const essController = require("../controllers/essController");
const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");

// Ensure only authenticated users can access ESS routes
router.use(authMiddleware);

// Employee Dashboard Data
router.get("/dashboard", essController.getDashboardData);

// Employee Profile Data
router.get("/profile", essController.getMyProfile);

// Employee Leaves
router.get("/leaves", essController.getMyLeaves);
router.post("/leaves", essController.applyLeave);
router.delete("/leaves/:id", essController.cancelLeave); // Only if pending

// Employee Attendance
router.get("/attendance", essController.getMyAttendance);
router.post("/attendance/check-in", essController.checkIn);
router.post("/attendance/check-out", essController.checkOut);

// Employee Payroll
router.get("/payroll", essController.getMyPayroll);

// Employee Tasks
router.get("/tasks", essController.getMyTasks);

// Employee Tickets
router.get("/tickets", essController.getMyTickets);
router.post("/tickets", essController.raiseTicket);

// Employee Assets
router.get("/assets", essController.getMyAssets);

module.exports = router;
