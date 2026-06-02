import { useEffect, useState } from "react";
import { getAssets } from "../asset/services/assetService";
import { useNavigate } from "react-router-dom";

function AssetDashboard() {
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getAssets();
        setAssets(data);
      } catch (error) {
        console.error("Error loading asset dashboard:", error);
      }
    };

    fetchAssets();
  }, []);

  const totalAssets = assets.length;

  const availableAssets = assets.filter(
    (asset) => asset.status === "Available"
  ).length;

  const assignedAssets = assets.filter(
    (asset) => asset.status === "Assigned"
  ).length;

  const maintenanceAssets = assets.filter(
    (asset) => asset.status === "Under Maintenance"
  ).length;

  const totalAssetValue = assets.reduce(
    (sum, asset) => sum + (asset.purchaseCost || 0),
    0
  );

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
      <h1>Asset Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Assets</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalAssets}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Available Assets</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "green",
            }}
          >
            {availableAssets}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Assigned Assets</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {assignedAssets}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Under Maintenance</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "orange",
            }}
          >
            {maintenanceAssets}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Asset Value</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "red",
            }}
          >
            ₹{totalAssetValue}
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

export default AssetDashboard;