import { useEffect, useState } from "react";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import StatusBadge from "../../component/ui/StatusBadge";
import { apiRequest } from "../../utils/api";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/api/projects/me");
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching my projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  return (
    <MainLayout>
      <PageHeader
        title="My Assigned Projects"
        subtitle="Review projects you manage or participate in as a team member"
      />

      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0 }}>Project Assignments ({projects.length})</h3>
        </div>

        <div className="card-body">
          {loading ? (
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Loading your projects...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
              You are not currently assigned to any projects.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Project Manager</th>
                    <th>Priority</th>
                    <th>Target Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj._id}>
                      <td>
                        <strong>{proj.projectName}</strong>
                        {proj.description && (
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {proj.description}
                          </div>
                        )}
                      </td>
                      <td>{proj.projectManager?.name || "Unassigned"}</td>
                      <td>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "600",
                            background:
                              proj.priority === "High"
                                ? "#fee2e2"
                                : proj.priority === "Medium"
                                ? "#fef3c7"
                                : "#f3f4f6",
                            color:
                              proj.priority === "High"
                                ? "#b91c1c"
                                : proj.priority === "Medium"
                                ? "#b45309"
                                : "#374151",
                          }}
                        >
                          {proj.priority}
                        </span>
                      </td>
                      <td>{proj.dueDate ? new Date(proj.dueDate).toLocaleDateString() : "-"}</td>
                      <td>
                        <StatusBadge status={proj.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default MyProjects;
