const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getLeaves,
  updateLeaveStatus
} = require("../controllers/leaveController");

const {
  authMiddleware,
  adminMiddleware
} = require("../../../middleware/authMiddleware");

// Apply Leave (authenticated users)
router.post(
  "/leaves",
  authMiddleware,
  applyLeave
);

// Get All Leave Requests
router.get(
  "/leaves",
  authMiddleware,
  getLeaves
);

// Approve / Reject Leave (admin only)
router.put(
  "/leaves/:id",
  authMiddleware,
  adminMiddleware,
  updateLeaveStatus
);

module.exports = router;