import { useEffect, useState } from "react";
import { getLeads } from "../crm/services/crmService";
import { useNavigate } from "react-router-dom";

function CRMDashboard() {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (error) {
        console.error("Error loading CRM dashboard:", error);
      }
    };

    fetchLeads();
  }, []);

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(
    (lead) => lead.stage === "Qualified"
  ).length;
  const wonDeals = leads.filter(
    (lead) => lead.stage === "Won"
  ).length;
  const lostDeals = leads.filter(
    (lead) => lead.stage === "Lost"
  ).length;

  const totalWonValue = leads
    .filter((lead) => lead.stage === "Won")
    .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);

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
      <h1>CRM Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Leads</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalLeads}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Qualified Leads</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "orange",
            }}
          >
            {qualifiedLeads}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Won Deals</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "green",
            }}
          >
            {wonDeals}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Lost Deals</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "red",
            }}
          >
            {lostDeals}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Won Value</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            ₹{totalWonValue}
          </p>
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CRMDashboard;