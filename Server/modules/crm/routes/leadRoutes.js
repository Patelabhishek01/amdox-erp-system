const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

// Create Lead
router.post("/", createLead);

// Get All Leads (with optional ?search=)
router.get("/", getLeads);

// Get Single Lead
router.get("/:id", getLeadById);

// Update Lead
router.put("/:id", updateLead);

// Delete Lead
router.delete("/:id", deleteLead);

module.exports = router;