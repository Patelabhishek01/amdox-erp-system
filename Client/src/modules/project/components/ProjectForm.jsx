import { useEffect, useState } from "react";
import { apiRequest } from "../../../utils/api";

function ProjectForm({ onSubmit, editingProject, onCancel }) {
  const [employees, setEmployees] = useState([]);
  
  const [formData, setFormData] = useState({
    projectName: "",
    projectManager: "",
    teamMembers: [],
    dueDate: "",
    priority: "Medium",
    status: "Pending",
    description: "",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiRequest("/api/employees");
        if (res.ok) {
          const data = await res.json();
          setEmployees(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (editingProject) {
      const pmId = editingProject.projectManager?._id || editingProject.projectManager || "";
      const memberIds = Array.isArray(editingProject.teamMembers) && editingProject.teamMembers.length > 0
        ? editingProject.teamMembers.map(m => (typeof m === "object" && m?._id ? m._id : m))
        : (Array.isArray(editingProject.assignedTo) ? editingProject.assignedTo.map(m => (typeof m === "object" && m?._id ? m._id : m)) : []);

      setFormData({
        projectName: editingProject.projectName || "",
        projectManager: pmId,
        teamMembers: memberIds,
        dueDate: editingProject.dueDate
          ? editingProject.dueDate.slice(0, 10)
          : "",
        priority: editingProject.priority || "Medium",
        status: editingProject.status || "Pending",
        description: editingProject.description || "",
      });
    } else {
      setFormData({
        projectName: "",
        projectManager: "",
        teamMembers: [],
        dueDate: "",
        priority: "Medium",
        status: "Pending",
        description: "",
      });
    }
  }, [editingProject]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setErrorMsg("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTeamMembersChange = (e) => {
    setErrorMsg("");
    const options = e.target.options;
    const values = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      teamMembers: values,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const payload = {
      ...formData,
      projectManager: formData.projectManager || null,
      teamMembers: (formData.teamMembers || []).filter(Boolean),
    };

    try {
      await onSubmit(payload);

      if (!editingProject) {
        setFormData({
          projectName: "",
          projectManager: "",
          teamMembers: [],
          dueDate: "",
          priority: "Medium",
          status: "Pending",
          description: "",
        });
      }
    } catch (err) {
      console.error("Error submitting project form:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to save project";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "4px",
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-muted, #555)",
  };

  const buttonStyle = {
    padding: "10px 16px",
    marginRight: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "16px" }}>{editingProject ? "Edit Project" : "Add Project"}</h3>

      <div>
        <label style={labelStyle}>Project Name *</label>
        <input
          type="text"
          name="projectName"
          placeholder="e.g. ERP Migration Phase 2"
          value={formData.projectName}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Project Manager Dropdown */}
        <div>
          <label style={labelStyle}>Project Manager (Single Select)</label>
          <select
            name="projectManager"
            value={formData.projectManager}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">-- Select Project Manager --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} — {emp.designation} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label style={labelStyle}>Target Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Team Members Multi-Select */}
      <div>
        <label style={labelStyle}>
          Project Team Members (Hold Ctrl/Cmd to select multiple)
        </label>
        <select
          name="teamMembers"
          multiple
          value={formData.teamMembers}
          onChange={handleTeamMembersChange}
          style={{ ...inputStyle, minHeight: "100px" }}
        >
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} — {emp.designation} ({emp.department})
            </option>
          ))}
        </select>
        <p style={{ fontSize: "11px", color: "var(--text-muted, #777)", marginTop: "-6px", marginBottom: "12px" }}>
          Selected {formData.teamMembers.length} team member(s). Employees must belong to this team to receive task assignments.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Description & Scope</label>
        <textarea
          name="description"
          placeholder="Brief description of the project deliverables..."
          value={formData.description}
          onChange={handleChange}
          rows="3"
          style={inputStyle}
        />
      </div>

      {errorMsg && (
        <div
          style={{
            padding: "10px 14px",
            marginBottom: "16px",
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fca5a5",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      <div style={{ marginTop: "8px" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            background: loading ? "#93c5fd" : "#2563eb",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? (editingProject ? "Updating Project..." : "Creating Project...")
            : (editingProject ? "Update Project" : "Create Project")}
        </button>

        {editingProject && (
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            style={{
              ...buttonStyle,
              background: "#6b7280",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProjectForm;