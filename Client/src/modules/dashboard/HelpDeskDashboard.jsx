import { useEffect, useState } from "react";
import { getTickets } from "../helpdesk/services/helpDeskService";
import { useNavigate } from "react-router-dom";

function HelpDeskDashboard() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error loading Help Desk dashboard:", error);
      }
    };

    fetchTickets();
  }, []);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const criticalTickets = tickets.filter(
    (ticket) => ticket.priority === "Critical"
  ).length;

  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flex: "1",
    minWidth: "220px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Help Desk Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Tickets</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalTickets}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Open Tickets</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "orange",
            }}
          >
            {openTickets}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>In Progress</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {inProgressTickets}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Resolved Tickets</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "green",
            }}
          >
            {resolvedTickets}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Critical Tickets</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "red",
            }}
          >
            {criticalTickets}
          </p>
        </div>
      </div>
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default HelpDeskDashboard;