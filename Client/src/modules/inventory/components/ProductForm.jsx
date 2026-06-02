import { useEffect, useState } from "react";

const ProductForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
    reorderLevel: "",
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (
      initialData &&
      Object.keys(initialData).length > 0
    ) {
      setFormData({
        name: initialData.name || "",
        sku: initialData.sku || "",
        category: initialData.category || "",
        quantity:
          initialData.quantity ?? "",
        price: initialData.price ?? "",
        supplier:
          initialData.supplier || "",
        reorderLevel:
          initialData.reorderLevel ?? "",
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "quantity",
      "price",
      "reorderLevel",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
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

      <label style={labelStyle}>SKU</label>
      <input
        type="text"
        name="sku"
        value={formData.sku}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Category</label>
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Quantity</label>
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
        min="0"
        style={inputStyle}
      />

      <label style={labelStyle}>Price</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
        min="0"
        step="0.01"
        style={inputStyle}
      />

      <label style={labelStyle}>Supplier</label>
      <input
        type="text"
        name="supplier"
        value={formData.supplier}
        onChange={handleChange}
        style={inputStyle}
      />

      <label style={labelStyle}>
        Reorder Level
      </label>
      <input
        type="number"
        name="reorderLevel"
        value={formData.reorderLevel}
        onChange={handleChange}
        min="0"
        style={inputStyle}
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
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
};

export default ProductForm;