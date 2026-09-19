import { useState } from "react";
import ProjectTasksModal from "./ProjectTasksModal";

function ProjectList({ projects, onEdit, onDelete }) {
  const [taskModalProject, setTaskModalProject] = useState(null);

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
    fontSize: "12px",
    fontWeight: "600",
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
      <h3 style={{ marginTop: 0 }}>Project Portfolio</h3>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            <th style={thTdStyle}>Project Name</th>
            <th style={thTdStyle}>Project Manager</th>
            <th style={thTdStyle}>Team Members</th>
            <th style={thTdStyle}>Due Date</th>
            <th style={thTdStyle}>Priority</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => {
            const pmName = project.projectManager?.name
              ? `${project.projectManager.name} (${project.projectManager.department || "PM"})`
              : "Unassigned";

            const members = Array.isArray(project.teamMembers) && project.teamMembers.length > 0
              ? project.teamMembers
              : (Array.isArray(project.assignedTo) ? project.assignedTo : []);

            return (
              <tr key={project._id}>
                <td style={{ ...thTdStyle, fontWeight: "600" }}>{project.projectName}</td>
                <td style={thTdStyle}>{pmName}</td>
                <td style={thTdStyle}>
                  {members.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {members.map((emp, i) => (
                        <span
                          key={emp._id || i}
                          style={{
                            background: "#e0f2fe",
                            color: "#0369a1",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            fontSize: "11px",
                          }}
                        >
                          {emp.name || "Member"}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: "#9ca3af" }}>No team members</span>
                  )}
                </td>
                <td style={thTdStyle}>
                  {project.dueDate
                    ? new Date(project.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td style={thTdStyle}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background:
                        project.priority === "High"
                          ? "#fee2e2"
                          : project.priority === "Medium"
                          ? "#fef3c7"
                          : "#f3f4f6",
                      color:
                        project.priority === "High"
                          ? "#b91c1c"
                          : project.priority === "Medium"
                          ? "#b45309"
                          : "#374151",
                    }}
                  >
                    {project.priority}
                  </span>
                </td>
                <td style={thTdStyle}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background:
                        project.status === "Completed"
                          ? "#dcfce7"
                          : project.status === "In Progress"
                          ? "#dbeafe"
                          : "#f3f4f6",
                      color:
                        project.status === "Completed"
                          ? "#15803d"
                          : project.status === "In Progress"
                          ? "#1d4ed8"
                          : "#374151",
                    }}
                  >
                    {project.status}
                  </span>
                </td>
                <td style={thTdStyle}>
                  <button
                    onClick={() => setTaskModalProject(project)}
                    style={{
                      ...actionButtonStyle,
                      background: "#2563eb",
                    }}
                    title="View & assign tasks for this project"
                  >
                    Tasks
                  </button>

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
            );
          })}
        </tbody>
      </table>

      {/* Tasks Modal */}
      {taskModalProject && (
        <ProjectTasksModal
          project={taskModalProject}
          onClose={() => setTaskModalProject(null)}
        />
      )}
    </div>
  );
}

export default ProjectList;