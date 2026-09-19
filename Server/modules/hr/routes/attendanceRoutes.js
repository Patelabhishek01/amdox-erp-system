const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance
} = require("../controllers/attendanceController");

const {
  authMiddleware,
  checkRole
} = require("../../../middleware/authMiddleware");

const hrRoles = checkRole(["admin", "hr"]);

// Mark Attendance (Admin & HR)
router.post(
  "/attendance",
  authMiddleware,
  hrRoles,
  markAttendance
);

// Get Attendance Records
router.get(
  "/attendance",
  authMiddleware,
  getAttendance
);

module.exports = router;