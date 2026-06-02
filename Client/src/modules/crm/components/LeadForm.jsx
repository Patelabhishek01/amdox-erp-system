import { useEffect, useState } from "react";

function LeadForm({ onSubmit, editingLead, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    dealValue: 0,
    stage: "New",
    notes: "",
  });

  useEffect(() => {
    if (editingLead) {
      setFormData({
        name: editingLead.name || "",
        company: editingLead.company || "",
        email: editingLead.email || "",
        phone: editingLead.phone || "",
        dealValue: editingLead.dealValue || 0,
        stage: editingLead.stage || "New",
        notes: editingLead.notes || "",
      });
    } else {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        dealValue: 0,
        stage: "New",
        notes: "",
      });
    }
  }, [editingLead]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "dealValue"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingLead) {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        dealValue: 0,
        stage: "New",
        notes: "",
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
      <h3>{editingLead ? "Edit Lead" : "Add Lead"}</h3>

      <input
        type="text"
        name="name"
        placeholder="Lead Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <input
        type="text"
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="number"
        name="dealValue"
        placeholder="Deal Value"
        value={formData.dealValue}
        onChange={handleChange}
        min="0"
        style={inputStyle}
      />

      <select
        name="stage"
        value={formData.stage}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="New">New</option>
        <option value="Qualified">Qualified</option>
        <option value="Proposal">Proposal</option>
        <option value="Won">Won</option>
        <option value="Lost">Lost</option>
      </select>

      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        rows="3"
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
        {editingLead ? "Update" : "Add"}
      </button>

      {editingLead && (
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

export default LeadForm;