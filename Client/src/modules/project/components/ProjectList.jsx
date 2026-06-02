function ProjectList({ projects, onEdit, onDelete }) {
  if (projects.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        No projects found.
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
      <h3>Project List</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Project Name</th>
            <th style={thTdStyle}>Assigned To</th>
            <th style={thTdStyle}>Due Date</th>
            <th style={thTdStyle}>Priority</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td style={thTdStyle}>{project.projectName}</td>
              <td style={thTdStyle}>{project.assignedTo}</td>
              <td style={thTdStyle}>
                {project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString()
                  : "-"}
              </td>
              <td style={thTdStyle}>{project.priority}</td>
              <td style={thTdStyle}>{project.status}</td>
              <td style={thTdStyle}>
                <button
                  onClick={() => onEdit(project)}
                  style={{
                    ...actionButtonStyle,
                    background: "#f59e0b",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(project._id)}
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

export default ProjectList;