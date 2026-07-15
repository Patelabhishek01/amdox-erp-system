import { useEffect, useState } from "react";
import { getAssets } from "../asset/services/assetService";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";

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
    <MainLayout>
      <PageHeader
        title="Asset Analytics Dashboard"
        subtitle="Track availability metrics, valuations, and maintenance logs for company assets."
        backUrl="/dashboard"
      />

      <div style={{ marginTop: "24px" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {/* Card 1 */}
          <div style={cardStyle}>
            <h3>Total Assets</h3>
            <p
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                margin: "10px 0 0",
              }}
            >
              {totalAssets}
            </p>
          </div>

          {/* Card 2 */}
          <div style={cardStyle}>
            <h3>Available</h3>
            <p
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                margin: "10px 0 0",
                color: "green",
              }}
            >
              {availableAssets}
            </p>
          </div>

          {/* Card 3 */}
          <div style={cardStyle}>
            <h3>Assigned</h3>
            <p
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                margin: "10px 0 0",
                color: "blue",
              }}
            >
              {assignedAssets}
            </p>
          </div>

          {/* Card 4 */}
          <div style={cardStyle}>
            <h3>Under Maintenance</h3>
            <p
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                margin: "10px 0 0",
                color: "orange",
              }}
            >
              {maintenanceAssets}
            </p>
          </div>

          {/* Card 5 */}
          <div style={cardStyle}>
            <h3>Total Asset Valuation</h3>
            <p
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                margin: "10px 0 0",
              }}
            >
              ₹{totalAssetValue}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AssetDashboard;