const Ticket = require("../models/Ticket");

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create ticket",
      error: error.message,
    });
  }
};

// Get All Tickets (with search)
exports.getTickets = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const tickets = await Ticket.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { assignedTo: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

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
    const ticket = await Ticket.findById(req.params.id);

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
    );

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