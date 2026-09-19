import React, { useEffect, useState } from "react";
import MainLayout from "../../component/layouts/MainLayout";
import { apiRequest } from "../../utils/api";
import KPICard from "../../component/ui/KPICard";
import { FaCalendarAlt, FaTasks, FaTicketAlt } from "react-icons/fa";

const ESSDashboard = () => {
  const [data, setData] = useState({
    employeeInfo: { name: "", designation: "", department: "" },
    stats: { pendingLeaves: 0, totalTickets: 0, assignedTasks: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchESSData();
  }, []);

  const fetchESSData = async () => {
    try {
      const response = await apiRequest("/api/ess/dashboard");
      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData);
      }
    } catch (error) {
      console.error("Error fetching ESS data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-content" style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px", color: "var(--text-color)" }}>
          Welcome back, {data.employeeInfo.name}!
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
          {data.employeeInfo.designation} - {data.employeeInfo.department}
        </p>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="kpi-grid">
            <KPICard
              title="Pending Leaves"
              value={data.stats.pendingLeaves}
              icon={<FaCalendarAlt />}
              change="0%"
              trend="up"
            />
            <KPICard
              title="Assigned Tasks"
              value={data.stats.assignedTasks}
              icon={<FaTasks />}
              change="0%"
              trend="up"
            />
            <KPICard
              title="My Tickets"
              value={data.stats.totalTickets}
              icon={<FaTicketAlt />}
              change="0%"
              trend="up"
            />
          </div>
        )}

        <div className="content-grid" style={{ marginTop: "32px" }}>
          <div className="card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="card-body" style={{ padding: "20px" }}>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", margin: 0, padding: 0 }}>
                <li><a href="/leaves" style={{ color: "var(--primary-color)", textDecoration: "none" }}>Apply for Leave</a></li>
                <li><a href="/attendance" style={{ color: "var(--primary-color)", textDecoration: "none" }}>Mark Attendance</a></li>
                <li><a href="/helpdesk" style={{ color: "var(--primary-color)", textDecoration: "none" }}>Raise IT Ticket</a></li>
              </ul>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Recent Announcements</h3>
            </div>
            <div className="card-body" style={{ padding: "20px" }}>
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No recent announcements from HR.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ESSDashboard;
