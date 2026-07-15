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
  const role = localStorage.getItem("role") || "employee";
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [editingTicket, setEditingTicket] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [repairLogs, setRepairLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Fetch previous repair logs when a ticket is selected
  useEffect(() => {
    if (selectedTicket && selectedTicket.associatedAssetId) {
      const assetId = selectedTicket.associatedAssetId._id || selectedTicket.associatedAssetId;
      fetchRepairLogs(assetId);
    } else {
      setRepairLogs([]);
    }
  }, [selectedTicket]);

  const fetchRepairLogs = async (assetId) => {
    try {
      setLoadingLogs(true);
      const res = await fetch(`http://localhost:5000/api/tickets?associatedAssetId=${assetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Exclude currently viewed ticket
        setRepairLogs(data.filter(t => t._id !== selectedTicket._id));
      }
    } catch (err) {
      console.error("Error fetching asset repair logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

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
        await updateTicket(editingTicket._id, formData);
        setEditingTicket(null);
      } else {
        await createTicket(formData);
      }
      setShowForm(false);
      fetchTickets();
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  };

  /* =========================
     Delete Ticket
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;

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
        actionText={showForm ? "Hide Form" : (editingTicket ? "Editing Ticket" : "Create Ticket")}
        onAction={() => {
          if (showForm) {
            setEditingTicket(null);
          }
          setShowForm(!showForm);
        }}
      />

      {/* Ticket Form */}
      {showForm && (
        <div className="card">
          <div className="card-header">
            <h3>
              {editingTicket ? "Update Ticket" : "Create New Ticket"}
            </h3>
          </div>

          <div className="card-body">
            <TicketForm
              onSubmit={handleSubmit}
              editingTicket={editingTicket}
              onCancel={() => {
                setEditingTicket(null);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

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

      {/* Responsive Grid with Split Details Panel */}
      <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Ticket List */}
        <div className="card" style={{ flex: selectedTicket ? "2 1 600px" : "1 1 100%", overflow: "hidden" }}>
          <div className="card-header">
            <h3>Ticket Queue</h3>
          </div>

          <div className="card-body">
            <TicketList
              tickets={tickets}
              role={role}
              onSelect={(ticket) => setSelectedTicket(ticket)}
              onEdit={(ticket) => {
                setEditingTicket(ticket);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Dynamic Asset Details and Repair Logs side panel */}
        {selectedTicket && (
          <div className="card glass-effect" style={{ flex: "1 1 350px", padding: "20px", height: "fit-content", position: "sticky", top: "100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Ticket: {selectedTicket.ticketId || selectedTicket._id.substring(18)}</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "16px", fontWeight: "700" }}
              >
                X
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <strong style={{ fontSize: "14px", display: "block" }}>{selectedTicket.title}</strong>
              <p style={{ fontSize: "13px", color: "#4b5563", marginTop: "4px", marginBottom: "8px" }}>
                {selectedTicket.description}
              </p>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                <span>Priority: <strong>{selectedTicket.priority}</strong></span> | <span>Status: <strong>{selectedTicket.status}</strong></span>
              </div>
            </div>

            {/* Associated Hardware Asset Specs */}
            {selectedTicket.associatedAssetId ? (
              <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb", marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#111827" }}>💻 Associated Corporate Asset</h4>
                <div style={{ fontSize: "12px", lineHeight: "1.6" }}>
                  <div>Name: <strong>{selectedTicket.associatedAssetId.assetName || "Unknown"}</strong></div>
                  <div>Serial: <strong>{selectedTicket.associatedAssetId.serialNumber || "N/A"}</strong></div>
                  <div>Category: <strong>{selectedTicket.associatedAssetId.category || "General"}</strong></div>
                  <div>Cost: <strong>${selectedTicket.associatedAssetId.cost || selectedTicket.associatedAssetId.purchaseCost || 0}</strong></div>
                  <div>Device Age: <strong>{
                    (() => {
                      const date = selectedTicket.associatedAssetId.purchaseDate;
                      if (!date) return "N/A";
                      const diffDays = Math.ceil(Math.abs(new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
                      if (diffDays < 30) return `${diffDays} days`;
                      const diffMonths = Math.ceil(diffDays / 30);
                      if (diffMonths < 12) return `${diffMonths} months`;
                      return `${(diffDays / 365).toFixed(1)} years`;
                    })()
                  }</strong></div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic", background: "#f3f4f6", padding: "8px", borderRadius: "6px", marginBottom: "20px" }}>
                No hardware asset associated with this ticket.
              </div>
            )}

            {/* Previous Repair logs query */}
            {selectedTicket.associatedAssetId && (
              <div>
                <h4 style={{ fontSize: "13px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px", marginBottom: "8px" }}>
                  🛠️ Previous Device Repair Logs ({repairLogs.length})
                </h4>
                {loadingLogs ? (
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Loading repair logs...</div>
                ) : repairLogs.length === 0 ? (
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No previous repair logs found for this device.</div>
                ) : (
                  <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "12px", lineHeight: "1.6" }}>
                    {repairLogs.map(log => (
                      <li key={log._id} style={{ marginBottom: "6px" }}>
                        <span style={{ fontWeight: "700" }}>{log.ticketId || log._id.substring(18)}</span>: {log.title} (<span style={{ fontStyle: "italic" }}>{log.status}</span>)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default HelpDesk;