import React, { useEffect, useState } from "react";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import StatusBadge from "../../component/ui/StatusBadge";
import KPICard from "../../component/ui/KPICard";
import { apiRequest } from "../../utils/api";
import {
  FaTasks,
  FaCalendarAlt,
  FaProjectDiagram,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaBuilding,
  FaIdBadge,
} from "react-icons/fa";

const EmployeeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    employeeInfo: null,
    projects: [],
    tasks: [],
    leaves: [],
    stats: {
      totalProjects: 0,
      pendingTasks: 0,
      completedTasks: 0,
      pendingLeaves: 0,
      approvedLeaves: 0,
    },
  });

  // Leave Modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "Sick",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState({ text: "", type: "" });

  // Hours logging state
  const [logHoursModalTask, setLogHoursModalTask] = useState(null);
  const [hoursToLog, setHoursToLog] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/api/ess/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching employee dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const res = await apiRequest(`/api/projects/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleLogHoursSubmit = async (e) => {
    e.preventDefault();
    if (!logHoursModalTask || !hoursToLog) return;
    try {
      const res = await apiRequest(`/api/projects/tasks/${logHoursModalTask._id}/log-hours`, {
        method: "PATCH",
        body: JSON.stringify({ hours: Number(hoursToLog) }),
      });
      if (res.ok) {
        setLogHoursModalTask(null);
        setHoursToLog("");
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to log hours");
      }
    } catch (error) {
      console.error("Error logging hours:", error);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLeaveSubmitting(true);
    setLeaveMessage({ text: "", type: "" });

    try {
      const res = await apiRequest("/api/leaves", {
        method: "POST",
        body: JSON.stringify(leaveForm),
      });

      const resData = await res.json();

      if (res.ok) {
        setLeaveMessage({ text: "Leave request submitted successfully! Pending HR approval.", type: "success" });
        setLeaveForm({
          leaveType: "Sick",
          startDate: "",
          endDate: "",
          reason: "",
        });
        fetchDashboardData();
        setTimeout(() => {
          setShowLeaveModal(false);
          setLeaveMessage({ text: "", type: "" });
        }, 1500);
      } else {
        setLeaveMessage({ text: resData.message || "Failed to apply for leave", type: "error" });
      }
    } catch (err) {
      setLeaveMessage({ text: "Server connection failed", type: "error" });
    } finally {
      setLeaveSubmitting(false);
    }
  };

  const emp = data.employeeInfo;

  return (
    <MainLayout>
      <PageHeader
        title="Employee Self-Service Console"
        subtitle="Manage your projects, task deliverables, and leave requests"
        actionText="+ Apply for Leave"
        onAction={() => setShowLeaveModal(true)}
      />

      {loading ? (
        <div className="card" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading your workspace...</p>
        </div>
      ) : (
        <>
          {/* 1. Employee Profile Header Card */}
          {emp && (
            <div
              className="card"
              style={{
                padding: "24px",
                marginBottom: "24px",
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    {emp.name ? emp.name.charAt(0) : "E"}
                  </div>
                  <div>
                    <h2 style={{ margin: "0 0 4px", fontSize: "22px", color: "#fff" }}>
                      {emp.name}
                    </h2>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
                      {emp.designation} &bull; {emp.department}
                    </p>
                  </div>
                </div>

                {/* Details Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}>
                    <span style={{ opacity: 0.8 }}>Employee ID: </span>
                    <strong>{emp.employeeId}</strong>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}>
                    <span style={{ opacity: 0.8 }}>Role: </span>
                    <strong>{emp.role}</strong>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}>
                    <span style={{ opacity: 0.8 }}>Joined: </span>
                    <strong>{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "-"}</strong>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}>
                    <span style={{ opacity: 0.8 }}>Status: </span>
                    <strong style={{ color: "#86efac" }}>{emp.status || "Active"}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Key Performance Indicators */}
          <div className="kpi-grid" style={{ marginBottom: "24px" }}>
            <KPICard
              title="My Assigned Projects"
              value={data.stats.totalProjects}
              icon={<FaProjectDiagram />}
              change="Active Portfolio"
              trend="up"
            />
            <KPICard
              title="Pending Tasks"
              value={data.stats.pendingTasks}
              icon={<FaTasks />}
              change={`${data.stats.completedTasks} Completed`}
              trend="neutral"
            />
            <KPICard
              title="Leave Requests"
              value={data.stats.pendingLeaves}
              icon={<FaCalendarAlt />}
              change={`${data.stats.approvedLeaves} Approved`}
              trend="up"
            />
          </div>

          {/* 3. My Tasks Section */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>My Assigned Tasks ({data.tasks.length})</h3>
            </div>
            <div className="card-body">
              {data.tasks.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
                  You have no tasks currently assigned.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Task Title</th>
                        <th>Project</th>
                        <th>Target Due Date</th>
                        <th>Hours Logged</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.tasks.map((task) => (
                        <tr key={task._id}>
                          <td>
                            <strong>{task.title}</strong>
                            {task.description && (
                              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                                {task.description}
                              </div>
                            )}
                          </td>
                          <td>{task.projectId?.projectName || "Direct Task"}</td>
                          <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                          <td>
                            <strong>{task.hoursLogged || 0} hrs</strong>
                          </td>
                          <td>
                            <select
                              value={task.status}
                              onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                              className="form-input"
                              style={{
                                padding: "4px 8px",
                                fontSize: "12px",
                                width: "auto",
                                borderColor:
                                  task.status === "Done"
                                    ? "#16a34a"
                                    : task.status === "In Progress"
                                    ? "#2563eb"
                                    : "#d97706",
                              }}
                            >
                              <option value="Todo">Todo</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                            </select>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setLogHoursModalTask(task);
                                setHoursToLog("");
                              }}
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                              <FaClock size={11} /> Log Hours
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 4. My Projects Section */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <div className="card-header">
              <h3 style={{ margin: 0 }}>My Projects ({data.projects.length})</h3>
            </div>
            <div className="card-body">
              {data.projects.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
                  You are not assigned to any projects currently.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Project Name</th>
                        <th>Project Manager</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.projects.map((proj) => (
                        <tr key={proj._id}>
                          <td>
                            <strong>{proj.projectName}</strong>
                            {proj.description && (
                              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                                {proj.description}
                              </div>
                            )}
                          </td>
                          <td>{proj.projectManager?.name || "Unassigned"}</td>
                          <td>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "10px",
                                fontSize: "11px",
                                fontWeight: "600",
                                background:
                                  proj.priority === "High"
                                    ? "#fee2e2"
                                    : proj.priority === "Medium"
                                    ? "#fef3c7"
                                    : "#f3f4f6",
                                color:
                                  proj.priority === "High"
                                    ? "#b91c1c"
                                    : proj.priority === "Medium"
                                    ? "#b45309"
                                    : "#374151",
                              }}
                            >
                              {proj.priority}
                            </span>
                          </td>
                          <td>{proj.dueDate ? new Date(proj.dueDate).toLocaleDateString() : "-"}</td>
                          <td>
                            <StatusBadge status={proj.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 5. My Leaves Section */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>My Leave Requests</h3>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setShowLeaveModal(true)}
              >
                Apply for Leave
              </button>
            </div>
            <div className="card-body">
              {data.leaves.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
                  No leave requests recorded.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                        <th>Approval Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.leaves.map((leave) => (
                        <tr key={leave._id}>
                          <td><strong>{leave.leaveType}</strong></td>
                          <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                          <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                          <td>{leave.reason}</td>
                          <td>
                            <StatusBadge status={leave.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>Apply for Leave</h3>
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" }}
              >
                ✕
              </button>
            </div>

            {leaveMessage.text && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  fontSize: "13px",
                  background: leaveMessage.type === "success" ? "#dcfce7" : "#fee2e2",
                  color: leaveMessage.type === "success" ? "#15803d" : "#b91c1c",
                }}
              >
                {leaveMessage.text}
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  className="form-input"
                  style={{ width: "100%" }}
                >
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Annual">Annual Leave</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Start Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="form-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>End Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="form-input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Reason for Leave *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Explain why you are requesting leave..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="form-input"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={leaveSubmitting}
                  className="btn btn-primary btn-sm"
                >
                  {leaveSubmitting ? "Submitting..." : "Submit Leave Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Hours Modal */}
      {logHoursModalTask && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 8px" }}>Log Task Hours</h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-muted)" }}>
              Task: <strong>{logHoursModalTask.title}</strong>
            </p>

            <form onSubmit={handleLogHoursSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Hours to add (numeric)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  placeholder="e.g. 2.5"
                  value={hoursToLog}
                  onChange={(e) => setHoursToLog(e.target.value)}
                  className="form-input"
                  style={{ width: "100%" }}
                  autoFocus
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setLogHoursModalTask(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Hours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default EmployeeDashboard;
