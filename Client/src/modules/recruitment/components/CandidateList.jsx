function CandidateList({
  candidates,
  onEdit,
  onDelete,
}) {
  if (candidates.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        No candidates found.
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
      <h3>Candidate List</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Email</th>
            <th style={thTdStyle}>Phone</th>
            <th style={thTdStyle}>Position</th>
            <th style={thTdStyle}>Experience</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate._id}>
              <td style={thTdStyle}>
                {candidate.candidateName}
              </td>
              <td style={thTdStyle}>
                {candidate.email}
              </td>
              <td style={thTdStyle}>
                {candidate.phone}
              </td>
              <td style={thTdStyle}>
                {candidate.position}
              </td>
              <td style={thTdStyle}>
                {candidate.experience} Years
              </td>
              <td style={thTdStyle}>
                {candidate.status}
              </td>
              <td style={thTdStyle}>
                <button
                  onClick={() =>
                    onEdit(candidate)
                  }
                  style={{
                    ...actionButtonStyle,
                    background: "#f59e0b",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(candidate._id)
                  }
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

export default CandidateList;