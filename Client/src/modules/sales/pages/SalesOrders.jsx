import { useEffect, useState } from "react";
import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";
import { getCustomers } from "../services/customerService";
import { getProducts } from "../../inventory/services/productService";
import { getSalesOrders, createSalesOrder, updateSalesOrder } from "../services/salesOrderService";

export default function SalesOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [customerId, setCustomerId] = useState("");
  const [selectedItems, setSelectedItems] = useState([{ productId: "", quantity: 1, price: 0 }]);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const ordersData = await getSalesOrders();
      const customersData = await getCustomers();
      const productsData = await getProducts();
      setOrders(ordersData || []);
      setCustomers(customersData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error("Error loading sales orders data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { productId: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const items = [...selectedItems];
    items.splice(index, 1);
    setSelectedItems(items);
  };

  const handleItemChange = (index, field, value) => {
    const items = [...selectedItems];
    items[index][field] = value;

    // Auto-populate price if product changes
    if (field === "productId") {
      const prod = products.find(p => p._id === value);
      if (prod) {
        items[index].price = prod.unitPrice || prod.price || 0;
      }
    }
    setSelectedItems(items);
  };

  // Submit Sales Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!customerId) return alert("Please select a customer");
      if (selectedItems.some(item => !item.productId || item.quantity <= 0)) {
        return alert("Please select products and valid quantities");
      }

      await createSalesOrder({
        customerId,
        items: selectedItems,
        paymentStatus
      });

      alert("Sales Order created successfully!");
      setShowForm(false);
      setCustomerId("");
      setSelectedItems([{ productId: "", quantity: 1, price: 0 }]);
      setPaymentStatus("Unpaid");
      loadData();
    } catch (err) {
      console.error("Error creating sales order:", err);
      alert(err.response?.data?.message || "Failed to create sales order");
    }
  };

  // Mark Paid
  const handleMarkPaid = async (id) => {
    try {
      await updateSalesOrder(id, { paymentStatus: "Paid" });
      alert("Order status updated to Paid. Finance ledger has been updated.");
      loadData();
    } catch (err) {
      console.error("Error updating order payment:", err);
      alert(err.response?.data?.message || "Failed to update order payment");
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Sales Orders"
        subtitle="Manage business transactions, record orders, deduct warehouse stock, and log cash receipts."
        actionText={showForm ? "View Orders" : "New Sales Order"}
        onAction={() => setShowForm(!showForm)}
      />

      {showForm ? (
        <div className="card">
          <div className="card-header">
            <h3>Create New Sales Order</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "700" }}>Customer</label>
                <select
                  className="form-input"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                  style={{ width: "100%" }}
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} - {c.company}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "700" }}>Order Items</label>
                {selectedItems.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "center" }}>
                    <select
                      className="form-input"
                      value={item.productId}
                      onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
                      required
                      style={{ flex: 2 }}
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.name} (SKU: {p.sku}) [Stock: {p.stockLevel !== undefined ? p.stockLevel : p.quantity}]
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Qty"
                      className="form-input"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                      required
                      style={{ width: "80px" }}
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      className="form-input"
                      value={item.price}
                      min="0"
                      onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                      required
                      style={{ width: "100px" }}
                    />

                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="btn btn-sm"
                        style={{ background: "#ef4444", color: "#fff" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-sm btn-secondary"
                  style={{ marginTop: "6px" }}
                >
                  + Add Item
                </button>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "700" }}>Payment Status</label>
                <select
                  className="form-input"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div style={{ marginTop: "24px", fontSize: "1.2rem", fontWeight: "700" }}>
                Total Order Value: ${calculateTotal().toFixed(2)}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" className="btn btn-primary">Create Order</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h3>Sales Order Ledger</h3>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loading ? (
                <div style={{ padding: "20px", textAlign: "center" }}>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state">No sales orders found. Click "New Sales Order" to start transacting.</div>
              ) : (
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Items Count</th>
                      <th>Total Value</th>
                      <th>Payment Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td style={{ fontWeight: "700" }}>{order._id.substring(18)}</td>
                        <td>{order.customerId?.name || "Deleted Customer"}</td>
                        <td>{order.items?.length || 0} items</td>
                        <td>${order.totalAmount?.toFixed(2)}</td>
                        <td>
                          <span
                            className={`badge badge-${order.paymentStatus === "Paid" ? "success" : "danger"}`}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontWeight: "bold",
                              fontSize: "0.85rem",
                              background: order.paymentStatus === "Paid" ? "#d1fae5" : "#fee2e2",
                              color: order.paymentStatus === "Paid" ? "#065f46" : "#991b1b"
                            }}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          {order.paymentStatus === "Unpaid" && (
                            <button
                              onClick={() => handleMarkPaid(order._id)}
                              className="btn btn-sm btn-primary"
                              style={{ background: "#10b981", borderColor: "#10b981", color: "#fff" }}
                            >
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
