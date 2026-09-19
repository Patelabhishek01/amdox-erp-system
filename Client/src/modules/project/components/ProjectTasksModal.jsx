import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { apiRequest } from "../../../utils/api";

function ProjectTasksModal({ project, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedEmployeeId: "",
    dueDate: "",
    status: "Todo",
  });

  const [allEmployees, setAllEmployees] = useState([]);

  const fetchTasks = async () => {
    if (!project?._id) return;
    try {
      setLoading(true);
      const res = await apiRequest(`/api/projects/tasks?projectId=${project._id}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const fetchEmployees = async () => {
      try {
        const res = await apiRequest("/api/employees");
        if (res.ok) {
          const data = await res.json();
          setAllEmployees(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error loading employees:", err);
      }
    };
    fetchEmployees();
  }, [project?._id]);

  // Lock background body scroll while Task Modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Combine project manager, team members, and all system employees as allowed assignees
  const candidateAssignees = [];
  
  // 1. PM
  if (project?.projectManager) {
    const pmObj = typeof project.projectManager === "object"
      ? project.projectManager
      : allEmployees.find(e => e._id === project.projectManager);
    if (pmObj && pmObj._id) {
      candidateAssignees.push({
        ...pmObj,
        labelRole: "Project Manager"
      });
    }
  }

  // 2. Team Members
  if (Array.isArray(project?.teamMembers)) {
    project.teamMembers.forEach(emp => {
      const empObj = typeof emp === "object"
        ? emp
        : allEmployees.find(e => e._id === emp);
      if (empObj && empObj._id && !candidateAssignees.some(c => c._id === empObj._id)) {
        candidateAssignees.push({
          ...empObj,
          labelRole: "Team Member"
        });
      }
    });
  }

  // 3. All other active employees
  allEmployees.forEach(emp => {
    if (emp && emp._id && !candidateAssignees.some(c => c._id === emp._id)) {
      candidateAssignees.push({
        ...emp,
        labelRole: "Employee"
      });
    }
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await apiRequest("/api/projects/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          projectId: project._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to assign task");
        return;
      }

      setSuccessMsg("Task assigned successfully!");
      setFormData({
        title: "",
        description: "",
        assignedEmployeeId: "",
        dueDate: "",
        status: "Todo",
      });
      fetchTasks();
    } catch (err) {
      setErrorMsg("Network error assigning task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await apiRequest(`/api/projects/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
        padding: "40px 24px",
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          maxWidth: "850px",
          width: "100%",
          maxHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          position: "relative",
          zIndex: 1000000,
          margin: "auto 0",
        }}
      >
        {/* Fixed Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 24px",
            borderBottom: "1px solid #e2e8f0",
            background: "#ffffff",
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>
              Tasks for Project: {project.projectName}
            </h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>
              PM: {project.projectManager?.name || "None"} | Team: {candidateAssignees.length} members
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid #e2e8f0",
              fontSize: "16px",
              cursor: "pointer",
              color: "#64748b",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            scrollBehavior: "smooth",
            overscrollBehavior: "contain",
          }}
        >
          {/* Feedback Messages */}
          {errorMsg && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ background: "#dcfce7", color: "#15803d", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
              ✅ {successMsg}
            </div>
          )}

          {/* Task Creation Form */}
          <form
            onSubmit={handleCreateTask}
            style={{
              background: "#f8fafc",
              padding: "18px",
              borderRadius: "10px",
              marginBottom: "24px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h4 style={{ margin: "0 0 14px", fontSize: "15px", color: "#0f172a", fontWeight: "600" }}>Assign New Task</h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Task Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Implement API route"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13.5px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Assign to Team Member *</label>
                <select
                  name="assignedEmployeeId"
                  value={formData.assignedEmployeeId}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13.5px", outline: "none" }}
                >
                  <option value="">-- Select Member --</option>
                  {candidateAssignees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.labelRole}) — {emp.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Task Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13.5px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13.5px", outline: "none" }}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Task Details / Instructions</label>
              <textarea
                name="description"
                placeholder="Task instructions..."
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13.5px", outline: "none", resize: "vertical" }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "9px 18px",
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13.5px",
                transition: "background 0.15s ease",
              }}
            >
              Assign Task
            </button>
          </form>

          {/* Existing Tasks List */}
          <h4 style={{ margin: "0 0 14px", fontSize: "15px", color: "#0f172a", fontWeight: "600" }}>Project Tasks ({tasks.length})</h4>

          {loading ? (
            <p style={{ color: "#64748b", fontSize: "13.5px" }}>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p style={{ color: "#64748b", fontStyle: "italic", fontSize: "13.5px" }}>No tasks created for this project yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                    <th style={{ padding: "10px 12px", border: "1px solid #e2e8f0", color: "#334155" }}>Task</th>
                    <th style={{ padding: "10px 12px", border: "1px solid #e2e8f0", color: "#334155" }}>Assigned To</th>
                    <th style={{ padding: "10px 12px", border: "1px solid #e2e8f0", color: "#334155" }}>Due Date</th>
                    <th style={{ padding: "10px 12px", border: "1px solid #e2e8f0", color: "#334155" }}>Hours</th>
                    <th style={{ padding: "10px 12px", border: "1px solid #e2e8f0", color: "#334155" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t._id}>
                      <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", fontWeight: "600", color: "#0f172a" }}>{t.title}</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                        {t.assignedEmployeeId?.name ? (
                          <span>{t.assignedEmployeeId.name} <small style={{ color: "#64748b" }}>({t.assignedEmployeeId.department})</small></span>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
                      </td>
                      <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0" }}>{t.hoursLogged || 0} hrs</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusChange(t._id, e.target.value)}
                          style={{ padding: "5px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", outline: "none" }}
                        >
                          <option value="Todo">Todo</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #e2e8f0",
            background: "#f8fafc",
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 20px",
              background: "#64748b",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13.5px",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ProjectTasksModal;
