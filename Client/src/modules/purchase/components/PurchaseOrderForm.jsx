import { useEffect, useState } from "react";

function PurchaseOrderForm({
  vendors,
  onSubmit,
  editingPurchaseOrder,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    vendor: "",
    orderNumber: "",
    quantity: 1,
    price: 0,
    status: "Pending",
    expectedDeliveryDate: "",
    notes: "",
  });

  useEffect(() => {
    if (editingPurchaseOrder) {
      const firstItem = editingPurchaseOrder.items?.[0] || {};

      setFormData({
        vendor:
          editingPurchaseOrder.vendor?._id ||
          editingPurchaseOrder.vendor ||
          "",
        orderNumber: editingPurchaseOrder.orderNumber || "",
        quantity: firstItem.quantity || 1,
        price: firstItem.price || 0,
        status: editingPurchaseOrder.status || "Pending",
        expectedDeliveryDate: editingPurchaseOrder.expectedDeliveryDate
          ? editingPurchaseOrder.expectedDeliveryDate.slice(0, 10)
          : "",
        notes: editingPurchaseOrder.notes || "",
      });
    } else {
      setFormData({
        vendor: "",
        orderNumber: "",
        quantity: 1,
        price: 0,
        status: "Pending",
        expectedDeliveryDate: "",
        notes: "",
      });
    }
  }, [editingPurchaseOrder]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      vendor: formData.vendor,
      orderNumber: formData.orderNumber,
      items: [
        {
          productName: "General Item",
          quantity: Number(formData.quantity),
          price: Number(formData.price),
        },
      ],
      totalAmount:
        Number(formData.quantity) * Number(formData.price),
      status: formData.status,
      expectedDeliveryDate: formData.expectedDeliveryDate || null,
      notes: formData.notes,
    };

    onSubmit(payload);

    if (!editingPurchaseOrder) {
      setFormData({
        vendor: "",
        orderNumber: "",
        quantity: 1,
        price: 0,
        status: "Pending",
        expectedDeliveryDate: "",
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
      <h3>
        {editingPurchaseOrder
          ? "Edit Purchase Order"
          : "Create Purchase Order"}
      </h3>

      <select
        name="vendor"
        value={formData.vendor}
        onChange={handleChange}
        required
        style={inputStyle}
      >
        <option value="">Select Vendor</option>
        {vendors.map((vendor) => (
          <option key={vendor._id} value={vendor._id}>
            {vendor.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="orderNumber"
        placeholder="Order Number"
        value={formData.orderNumber}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        min="1"
        required
        style={inputStyle}
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        min="0"
        required
        style={inputStyle}
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Received">Received</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <input
        type="date"
        name="expectedDeliveryDate"
        value={formData.expectedDeliveryDate}
        onChange={handleChange}
        style={inputStyle}
      />

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
        {editingPurchaseOrder ? "Update" : "Create"}
      </button>

      {editingPurchaseOrder && (
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

export default PurchaseOrderForm;