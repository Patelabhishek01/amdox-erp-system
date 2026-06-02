import { useEffect, useState } from "react";

function VendorForm({ onSubmit, editingVendor, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (editingVendor) {
      setFormData({
        name: editingVendor.name || "",
        company: editingVendor.company || "",
        email: editingVendor.email || "",
        phone: editingVendor.phone || "",
        address: editingVendor.address || "",
      });
    } else {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [editingVendor]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingVendor) {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
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
      <h3>{editingVendor ? "Edit Vendor" : "Add Vendor"}</h3>

      <input
        type="text"
        name="name"
        placeholder="Vendor Name"
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

      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
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
        {editingVendor ? "Update" : "Add"}
      </button>

      {editingVendor && (
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

export default VendorForm;