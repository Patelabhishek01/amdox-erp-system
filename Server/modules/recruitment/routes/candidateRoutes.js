const express = require("express");
const router = express.Router();

const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");

const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;
const hrRoles = checkRole(["admin", "hr"]);

// Create Candidate
router.post("/", protect, hrRoles, createCandidate);

// Get All Candidates (with optional ?search=)
router.get("/", protect, hrRoles, getCandidates);

// Get Single Candidate
router.get("/:id", protect, hrRoles, getCandidateById);

// Update Candidate
router.put("/:id", protect, hrRoles, updateCandidate);
router.patch("/:id/status", protect, hrRoles, updateCandidate);

// Delete Candidate
router.delete("/:id", protect, hrRoles, deleteCandidate);

module.exports = router;