import { useEffect, useState } from "react";

function TicketForm({ onSubmit, editingTicket, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    status: "Open",
  });

  useEffect(() => {
    if (editingTicket) {
      setFormData({
        title: editingTicket.title || "",
        description: editingTicket.description || "",
        assignedTo: editingTicket.assignedTo || "",
        priority: editingTicket.priority || "Medium",
        status: editingTicket.status || "Open",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        status: "Open",
      });
    }
  }, [editingTicket]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingTicket) {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        status: "Open",
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
      <h3>{editingTicket ? "Edit Ticket" : "Add Ticket"}</h3>

      <input
        type="text"
        name="title"
        placeholder="Ticket Title"
        value={formData.title}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
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

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>

      <button
        type="submit"
        style={{
          ...buttonStyle,
          background: "#2563eb",
          color: "#fff",
        }}
      >
        {editingTicket ? "Update" : "Add"}
      </button>

      {editingTicket && (
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

export default TicketForm;