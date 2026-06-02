const express = require("express");
const router = express.Router();

const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");

// Create Candidate
router.post("/", createCandidate);

// Get All Candidates (with optional ?search=)
router.get("/", getCandidates);

// Get Single Candidate
router.get("/:id", getCandidateById);

// Update Candidate
router.put("/:id", updateCandidate);

// Delete Candidate
router.delete("/:id", deleteCandidate);

module.exports = router;