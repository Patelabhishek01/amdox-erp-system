const Lead = require("../models/Lead");

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

// Get All Leads (with search)
exports.getLeads = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const leads = await Lead.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { stage: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

// Get Single Lead
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const wasNotWon = lead.stage !== "Won" && lead.status !== "Won";

    // Apply updates
    Object.assign(lead, req.body);
    await lead.save();

    const isWon = lead.stage === "Won" || lead.status === "Won";

    // Auto-create customer if transitioned to Won
    if (isWon && wasNotWon) {
      try {
        const Customer = require("../../sales/models/Customer");
        await Customer.create({
          name: lead.name || lead.contactPerson || "Unknown",
          email: lead.email || `won-lead-${Date.now()}@example.com`,
          phone: lead.phone || "000-000-0000",
          company: lead.company || lead.companyName || "N/A",
          address: "Converted from Won Lead"
        });
        console.log("Customer profile automatically created for won lead in backend.");
      } catch (custError) {
        console.error("Failed to automatically create Customer Profile:", custError);
      }
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update lead",
      error: error.message,
    });
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};