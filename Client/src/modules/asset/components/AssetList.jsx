function AssetList({ assets, onEdit, onDelete }) {
  if (assets.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        No assets found.
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
      <h3>Asset List</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Asset Name</th>
            <th style={thTdStyle}>Category</th>
            <th style={thTdStyle}>Assigned To</th>
            <th style={thTdStyle}>Purchase Cost</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id}>
              <td style={thTdStyle}>{asset.assetName}</td>
              <td style={thTdStyle}>{asset.category}</td>
              <td style={thTdStyle}>{asset.assignedTo}</td>
              <td style={thTdStyle}>₹{asset.purchaseCost}</td>
              <td style={thTdStyle}>{asset.status}</td>
              <td style={thTdStyle}>
                <button
                  onClick={() => onEdit(asset)}
                  style={{
                    ...actionButtonStyle,
                    background: "#f59e0b",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(asset._id)}
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

export default AssetList;