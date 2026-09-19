const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
  getLeaves,
  updateLeaveStatus
} = require("../controllers/leaveController");

const {
  authMiddleware,
  checkRole
} = require("../../../middleware/authMiddleware");

const hrRoles = checkRole(["admin", "hr"]);

// Apply Leave (authenticated users)
router.post(
  "/leaves",
  authMiddleware,
  applyLeave
);

// Get My Leave Requests (self-service)
router.get(
  "/leaves/me",
  authMiddleware,
  getMyLeaves
);

// Get All Leave Requests (role-filtered)
router.get(
  "/leaves",
  authMiddleware,
  getLeaves
);

// Approve / Reject Leave (admin & HR)
router.put(
  "/leaves/:id",
  authMiddleware,
  hrRoles,
  updateLeaveStatus
);

module.exports = router;