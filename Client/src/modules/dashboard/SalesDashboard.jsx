import { useEffect, useState } from "react";
import { getCustomers } from "../sales/services/customerService";
import { useNavigate } from "react-router-dom";

const SalesDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        const data = response.data || response || [];

        setCustomers(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Error fetching customers:",
          error
        );
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        Loading sales dashboard...
      </div>
    );
  }

  // Analytics
  const totalCustomers = customers.length;

  const customersWithCompany =
    customers.filter(
      (customer) =>
        customer.company &&
        customer.company.trim() !== ""
    ).length;

  const customersWithoutCompany =
    totalCustomers -
    customersWithCompany;

  // Customers added in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  const newCustomers = customers.filter(
    (customer) =>
      customer.createdAt &&
      new Date(customer.createdAt) >=
        thirtyDaysAgo
  ).length;

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        Sales Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Customers</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {totalCustomers}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>New Customers (30 Days)</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {newCustomers}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Customers with Company</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#16a34a",
            }}
          >
            {customersWithCompany}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Individual Customers</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#d97706",
            }}
          >
            {customersWithoutCompany}
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
};

export default SalesDashboard;