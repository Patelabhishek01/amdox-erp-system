import { useEffect, useState } from "react";
import { getProjects } from "../project/services/projectService";
import { useNavigate } from "react-router-dom";

function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading project dashboard:", error);
      }
    };

    fetchProjects();
  }, []);

  const totalProjects = projects.length;

  const pendingProjects = projects.filter(
    (project) => project.status === "Pending"
  ).length;

  const inProgressProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const highPriorityProjects = projects.filter(
    (project) => project.priority === "High"
  ).length;

  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flex: "1",
    minWidth: "220px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Projects</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalProjects}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Pending Projects</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "orange",
            }}
          >
            {pendingProjects}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>In Progress</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {inProgressProjects}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Completed Projects</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "green",
            }}
          >
            {completedProjects}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>High Priority</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "red",
            }}
          >
            {highPriorityProjects}
          </p>
        </div>
      </div>
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ProjectDashboard;