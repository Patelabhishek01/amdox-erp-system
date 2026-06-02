import { useEffect, useState } from "react";
import {
  getVendors,
  getPurchaseOrders,
} from "../purchase/services/purchaseService";
import { useNavigate } from "react-router-dom";

function PurchaseDashboard() {
  const [vendors, setVendors] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorData = await getVendors();
        const orderData = await getPurchaseOrders();

        setVendors(vendorData);
        setPurchaseOrders(orderData);
      } catch (error) {
        console.error("Error loading purchase dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const totalVendors = vendors.length;
  const totalPurchaseOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(
    (order) => order.status === "Pending"
  ).length;
  const receivedOrders = purchaseOrders.filter(
    (order) => order.status === "Received"
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
      <h1>Purchase Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Vendors</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalVendors}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Purchase Orders</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalPurchaseOrders}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Pending Orders</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "orange" }}>
            {pendingOrders}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Received Orders</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "green" }}>
            {receivedOrders}
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

export default PurchaseDashboard;