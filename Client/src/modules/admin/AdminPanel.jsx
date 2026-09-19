import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import { FaUserCog, FaFileInvoice, FaShieldAlt } from "react-icons/fa";

const AdminPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (role !== "admin" && role !== "super admin") {
      alert("Access denied ❌");
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <MainLayout>
      <div style={{ padding: "20px" }}>
        <h1>👑 Admin Control Panel</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Welcome to the centralized administration area. Select a module below to manage your system.
        </p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Link to="/users" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              background: "white", padding: "30px", borderRadius: "12px", width: "250px", 
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center", cursor: "pointer", transition: "0.2s"
            }}>
              <FaUserCog size={40} color="#3b82f6" style={{ marginBottom: "15px" }} />
              <h3>User Management</h3>
              <p style={{ fontSize: "14px", color: "#666" }}>Approve new users, edit roles, and manage accounts.</p>
            </div>
          </Link>

          <Link to="/audit-logs" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              background: "white", padding: "30px", borderRadius: "12px", width: "250px", 
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center", cursor: "pointer", transition: "0.2s"
            }}>
              <FaFileInvoice size={40} color="#10b981" style={{ marginBottom: "15px" }} />
              <h3>Audit Logs</h3>
              <p style={{ fontSize: "14px", color: "#666" }}>Review system activity and security events.</p>
            </div>
          </Link>

          <div style={{
            background: "white", padding: "30px", borderRadius: "12px", width: "250px", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center", opacity: 0.7
          }}>
            <FaShieldAlt size={40} color="#8b5cf6" style={{ marginBottom: "15px" }} />
            <h3>Security Settings</h3>
            <p style={{ fontSize: "14px", color: "#666" }}>Configure global security policies (Coming Soon).</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;