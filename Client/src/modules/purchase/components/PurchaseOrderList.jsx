function PurchaseOrderList({
  purchaseOrders,
  onEdit,
  onDelete,
}) {
  if (purchaseOrders.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        No purchase orders found.
      </div>
    );
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    border: "1px solid #e5e7eb",
    padding: "10px",
    textAlign: "left",
  };

  const actionButtonStyle = {
    padding: "6px 10px",
    marginRight: "6px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#fff",
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflowX: "auto",
      }}
    >
      <h3>Purchase Order List</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Order No.</th>
            <th style={thTdStyle}>Vendor</th>
            <th style={thTdStyle}>Quantity</th>
            <th style={thTdStyle}>Price</th>
            <th style={thTdStyle}>Total</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {purchaseOrders.map((order) => {
            const firstItem = order.items?.[0] || {};

            return (
              <tr key={order._id}>
                <td style={thTdStyle}>{order.orderNumber}</td>
                <td style={thTdStyle}>
                  {order.vendor?.name || "N/A"}
                </td>
                <td style={thTdStyle}>
                  {firstItem.quantity || 0}
                </td>
                <td style={thTdStyle}>
                  ₹{firstItem.price || 0}
                </td>
                <td style={thTdStyle}>
                  ₹{order.totalAmount || 0}
                </td>
                <td style={thTdStyle}>{order.status}</td>
                <td style={thTdStyle}>
                  <button
                    onClick={() => onEdit(order)}
                    style={{
                      ...actionButtonStyle,
                      background: "#f59e0b",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(order._id)}
                    style={{
                      ...actionButtonStyle,
                      background: "#ef4444",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseOrderList;