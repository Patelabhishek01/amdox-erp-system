const Ticket = require("../models/Ticket");

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const ticketData = { ...req.body };
    
    // Automatically generate ticketId if not provided
    if (!ticketData.ticketId) {
      ticketData.ticketId = `TIC-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Set raisedByUserId if not explicitly in request body but user is logged in
    if (!ticketData.raisedByUserId && req.user && req.user.id) {
      ticketData.raisedByUserId = req.user.id;
    }

    const ticket = await Ticket.create(ticketData);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create ticket",
      error: error.message,
    });
  }
};

// Get All Tickets (with search & populates)
exports.getTickets = async (req, res) => {
  try {
    const { search = "", associatedAssetId } = req.query;
    
    const filter = {};
    if (associatedAssetId) {
      filter.associatedAssetId = associatedAssetId;
    }

    // Standard employees can only view their own raised tickets
    if (req.user && req.user.role === "employee") {
      filter.raisedByUserId = req.user.id;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { assignedTo: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate("raisedByUserId")
      .populate("associatedAssetId")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

// Get Single Ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("raisedByUserId")
      .populate("associatedAssetId");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ticket",
      error: error.message,
    });
  }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("raisedByUserId").populate("associatedAssetId");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ticket",
      error: error.message,
    });
  }
};