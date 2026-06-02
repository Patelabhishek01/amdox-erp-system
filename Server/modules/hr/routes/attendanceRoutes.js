const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance
} = require("../controllers/attendanceController");

const {
  authMiddleware,
  adminMiddleware
} = require("../../../middleware/authMiddleware");

// Mark Attendance (Admin only)
router.post(
  "/attendance",
  authMiddleware,
  adminMiddleware,
  markAttendance
);

// Get Attendance Records
router.get(
  "/attendance",
  authMiddleware,
  getAttendance
);

module.exports = router;