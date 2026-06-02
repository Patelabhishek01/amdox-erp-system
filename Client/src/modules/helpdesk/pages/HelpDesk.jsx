import { useEffect, useState } from "react";

import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";

import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/helpDeskService";

import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";

function HelpDesk() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [editingTicket, setEditingTicket] =
    useState(null);

  /* =========================
     Load Tickets
  ========================= */
  const fetchTickets = async () => {
    try {
      const data = await getTickets(search);
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search]);

  /* =========================
     Create / Update Ticket
  ========================= */
  const handleSubmit = async (formData) => {
    try {
      if (editingTicket) {
        await updateTicket(
          editingTicket._id,
          formData
        );
        setEditingTicket(null);
      } else {
        await createTicket(formData);
      }

      fetchTickets();
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  };

  /* =========================
     Delete Ticket
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?"))
      return;

    try {
      await deleteTicket(id);
      fetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Support Tickets"
        subtitle="Manage customer support and issue resolution"
        actionText={
          editingTicket
            ? "Editing Ticket"
            : "Create Ticket"
        }
        onAction={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      />

      {/* Search */}
      <div className="card">
        <div className="card-header">
          <h3>Search Tickets</h3>
        </div>

        <div className="card-body">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Ticket Form */}
      <div className="card">
        <div className="card-header">
          <h3>
            {editingTicket
              ? "Update Ticket"
              : "Create New Ticket"}
          </h3>
        </div>

        <div className="card-body">
          <TicketForm
            onSubmit={handleSubmit}
            editingTicket={editingTicket}
            onCancel={() =>
              setEditingTicket(null)
            }
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="card">
        <div className="card-header">
          <h3>Ticket Queue</h3>
        </div>

        <div className="card-body">
          <TicketList
            tickets={tickets}
            onEdit={setEditingTicket}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default HelpDesk;