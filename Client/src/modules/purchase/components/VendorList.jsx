function VendorList({ vendors, onEdit, onDelete }) {
  if (vendors.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        No vendors found.
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
      <h3>Vendor List</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Company</th>
            <th style={thTdStyle}>Email</th>
            <th style={thTdStyle}>Phone</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id}>
              <td style={thTdStyle}>{vendor.name}</td>
              <td style={thTdStyle}>{vendor.company}</td>
              <td style={thTdStyle}>{vendor.email}</td>
              <td style={thTdStyle}>{vendor.phone}</td>
              <td style={thTdStyle}>
                <button
                  onClick={() => onEdit(vendor)}
                  style={{
                    ...actionButtonStyle,
                    background: "#f59e0b",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(vendor._id)}
                  style={{
                    ...actionButtonStyle,
                    background: "#ef4444",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorList;