import { useEffect, useState } from "react";

function AssetForm({ onSubmit, editingAsset, onCancel }) {
  const [formData, setFormData] = useState({
    assetName: "",
    category: "",
    assignedTo: "",
    purchaseDate: "",
    purchaseCost: 0,
    status: "Available",
    description: "",
  });

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        assetName: editingAsset.assetName || "",
        category: editingAsset.category || "",
        assignedTo: editingAsset.assignedTo || "",
        purchaseDate: editingAsset.purchaseDate
          ? editingAsset.purchaseDate.slice(0, 10)
          : "",
        purchaseCost: editingAsset.purchaseCost || 0,
        status: editingAsset.status || "Available",
        description: editingAsset.description || "",
      });
    } else {
      setFormData({
        assetName: "",
        category: "",
        assignedTo: "",
        purchaseDate: "",
        purchaseCost: 0,
        status: "Available",
        description: "",
      });
    }
  }, [editingAsset]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "purchaseCost"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingAsset) {
      setFormData({
        assetName: "",
        category: "",
        assignedTo: "",
        purchaseDate: "",
        purchaseCost: 0,
        status: "Available",
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
      <h3>{editingAsset ? "Edit Asset" : "Add Asset"}</h3>

      <input
        type="text"
        name="assetName"
        placeholder="Asset Name"
        value={formData.assetName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
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
        name="purchaseDate"
        value={formData.purchaseDate}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="number"
        name="purchaseCost"
        placeholder="Purchase Cost"
        value={formData.purchaseCost}
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
        <option value="Available">Available</option>
        <option value="Assigned">Assigned</option>
        <option value="Under Maintenance">Under Maintenance</option>
        <option value="Retired">Retired</option>
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
        {editingAsset ? "Update" : "Add"}
      </button>

      {editingAsset && (
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

export default AssetForm;