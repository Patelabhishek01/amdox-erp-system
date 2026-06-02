import { useEffect, useState } from "react";

function ProjectForm({ onSubmit, editingProject, onCancel }) {
  const [formData, setFormData] = useState({
    projectName: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
    description: "",
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        projectName: editingProject.projectName || "",
        assignedTo: editingProject.assignedTo || "",
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
        assignedTo: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
        description: "",
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingProject) {
      setFormData({
        projectName: "",
        assignedTo: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
        description: "",
      });
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  };

  const buttonStyle = {
    padding: "10px 16px",
    marginRight: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
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
      <h3>{editingProject ? "Edit Project" : "Add Project"}</h3>

      <input
        type="text"
        name="projectName"
        placeholder="Project Name"
        value={formData.projectName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <input
        type="text"
        name="assignedTo"
        placeholder="Assigned To"
        value={formData.assignedTo}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        style={inputStyle}
      />

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

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        style={inputStyle}
      />

      <button
        type="submit"
        style={{
          ...buttonStyle,
          background: "#2563eb",
          color: "#fff",
        }}
      >
        {editingProject ? "Update" : "Add"}
      </button>

      {editingProject && (
        <button
          type="button"
          onClick={onCancel}
          style={{
            ...buttonStyle,
            background: "#6b7280",
            color: "#fff",
          }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default ProjectForm;