import { useEffect, useState } from "react";
import {
  getProducts,
} from "../inventory/services/poductService";
import { useNavigate } from "react-router-dom";

const InventoryDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        const data =
          response.data || response || [];

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        Loading inventory dashboard...
      </div>
    );
  }

  // Calculations
  const totalProducts = products.length;

  const totalStockQuantity = products.reduce(
    (sum, product) =>
      sum + (product.quantity || 0),
    0
  );

  const totalStockValue = products.reduce(
    (sum, product) =>
      sum +
      (product.quantity || 0) *
        (product.price || 0),
    0
  );

  const lowStockItems = products.filter(
    (product) =>
      (product.quantity || 0) <=
      (product.reorderLevel || 0)
  ).length;

  const outOfStockItems = products.filter(
    (product) =>
      (product.quantity || 0) === 0
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
        Inventory Dashboard
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
          <h3>Total Products</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {totalProducts}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Stock Quantity</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {totalStockQuantity}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Stock Value</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            ₹{totalStockValue.toFixed(2)}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Low Stock Items</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#d97706",
            }}
          >
            {lowStockItems}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Out of Stock</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#dc2626",
            }}
          >
            {outOfStockItems}
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

export default InventoryDashboard;