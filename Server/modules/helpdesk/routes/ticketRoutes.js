const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const { authMiddleware } = require("../../../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;

// Create Ticket
router.post("/", protect, createTicket);

// Get All Tickets (with optional ?search=)
router.get("/", protect, getTickets);

// Get Single Ticket
router.get("/:id", protect, getTicketById);

// Update Ticket
router.put("/:id", protect, updateTicket);

// Delete Ticket
router.delete("/:id", protect, deleteTicket);

module.exports = router;