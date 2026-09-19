import { useState, useEffect } from "react";
import MainLayout from "../component/layouts/MainLayout";
import DataTable from "../component/ui/DataTable";
import { apiRequest } from "../utils/api";
import StatusBadge from "../component/ui/StatusBadge";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/api/audit-logs?limit=500");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: "createdAt", 
      label: "Timestamp",
      render: (val) => new Date(val).toLocaleString()
    },
    { key: "userName", label: "User" },
    { 
      key: "module", 
      label: "Module",
      render: (val) => <StatusBadge status={val} />
    },
    { key: "action", label: "Action" },
    { key: "details", label: "Details" },
    { key: "ipAddress", label: "IP Address" }
  ];

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h2>System Audit Logs</h2>
          <p>Track all crucial events and activities across the ERP system.</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>Loading audit logs...</div>
        ) : (
          <DataTable
            columns={columns}
            data={logs}
            searchable={true}
          />
        )}
      </div>
    </MainLayout>
  );
}
