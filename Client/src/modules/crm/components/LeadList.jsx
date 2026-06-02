function LeadList({ leads, onEdit, onDelete }) {
  if (leads.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        No leads found.
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
      <h3>Lead List</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Company</th>
            <th style={thTdStyle}>Email</th>
            <th style={thTdStyle}>Phone</th>
            <th style={thTdStyle}>Deal Value</th>
            <th style={thTdStyle}>Stage</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td style={thTdStyle}>{lead.name}</td>
              <td style={thTdStyle}>{lead.company}</td>
              <td style={thTdStyle}>{lead.email}</td>
              <td style={thTdStyle}>{lead.phone}</td>
              <td style={thTdStyle}>₹{lead.dealValue}</td>
              <td style={thTdStyle}>{lead.stage}</td>
              <td style={thTdStyle}>
                <button
                  onClick={() => onEdit(lead)}
                  style={{
                    ...actionButtonStyle,
                    background: "#f59e0b",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(lead._id)}
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

export default LeadList;