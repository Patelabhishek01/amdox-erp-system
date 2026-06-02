import { useEffect, useState } from "react";

const CustomerForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (
      initialData &&
      Object.keys(initialData).length > 0
    ) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        company: initialData.company || "",
        address: initialData.address || "",
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const containerStyle = {
    maxWidth: "700px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow:
      "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    marginBottom: "16px",
    boxSizing: "border-box",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={containerStyle}
    >
      <label style={labelStyle}>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Phone</label>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Company</label>
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        style={inputStyle}
      />

      <label style={labelStyle}>Address</label>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        style={textareaStyle}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          ...buttonStyle,
          opacity: loading ? 0.7 : 1,
          cursor: loading
            ? "not-allowed"
            : "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Customer"}
      </button>
    </form>
  );
};

export default CustomerForm;