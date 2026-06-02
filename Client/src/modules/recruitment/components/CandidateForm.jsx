import { useEffect, useState } from "react";

function CandidateForm({
  onSubmit,
  editingCandidate,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    phone: "",
    position: "",
    status: "Applied",
    experience: 0,
    notes: "",
  });

  useEffect(() => {
    if (editingCandidate) {
      setFormData({
        candidateName:
          editingCandidate.candidateName || "",
        email: editingCandidate.email || "",
        phone: editingCandidate.phone || "",
        position: editingCandidate.position || "",
        status: editingCandidate.status || "Applied",
        experience: editingCandidate.experience || 0,
        notes: editingCandidate.notes || "",
      });
    } else {
      setFormData({
        candidateName: "",
        email: "",
        phone: "",
        position: "",
        status: "Applied",
        experience: 0,
        notes: "",
      });
    }
  }, [editingCandidate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "experience"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingCandidate) {
      setFormData({
        candidateName: "",
        email: "",
        phone: "",
        position: "",
        status: "Applied",
        experience: 0,
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
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      <h3>
        {editingCandidate
          ? "Edit Candidate"
          : "Add Candidate"}
      </h3>

      <input
        type="text"
        name="candidateName"
        placeholder="Candidate Name"
        value={formData.candidateName}
        onChange={handleChange}
        required
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
        type="text"
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="number"
        name="experience"
        placeholder="Experience (Years)"
        value={formData.experience}
        onChange={handleChange}
        min="0"
        style={inputStyle}
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="Applied">Applied</option>
        <option value="Screening">
          Screening
        </option>
        <option value="Interview">
          Interview
        </option>
        <option value="Offered">Offered</option>
        <option value="Hired">Hired</option>
        <option value="Rejected">
          Rejected
        </option>
      </select>

      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
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
        {editingCandidate
          ? "Update"
          : "Add"}
      </button>

      {editingCandidate && (
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

export default CandidateForm;