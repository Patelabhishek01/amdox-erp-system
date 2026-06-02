const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

// Create Ticket
router.post("/", createTicket);

// Get All Tickets (with optional ?search=)
router.get("/", getTickets);

// Get Single Ticket
router.get("/:id", getTicketById);

// Update Ticket
router.put("/:id", updateTicket);

// Delete Ticket
router.delete("/:id", deleteTicket);

module.exports = router;    