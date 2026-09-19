const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;
const crmRoles = checkRole(["admin", "crm", "sales"]);

// Create Lead
router.post("/", protect, crmRoles, createLead);

// Get All Leads (with optional ?search=)
router.get("/", protect, crmRoles, getLeads);

// Get Single Lead
router.get("/:id", protect, crmRoles, getLeadById);

// Update Lead
router.put("/:id", protect, crmRoles, updateLead);

// Delete Lead
router.delete("/:id", protect, crmRoles, deleteLead);

module.exports = router;