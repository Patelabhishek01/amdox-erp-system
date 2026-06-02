import { useEffect, useState } from "react";
import { getCandidates } from "../recruitment/services/recruitmentService";
import { useNavigate } from "react-router-dom";

function RecruitmentDashboard() {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error(
          "Error loading recruitment dashboard:",
          error
        );
      }
    };

    fetchCandidates();
  }, []);

  const totalCandidates = candidates.length;

  const appliedCandidates = candidates.filter(
    (candidate) => candidate.status === "Applied"
  ).length;

  const interviewCandidates = candidates.filter(
    (candidate) => candidate.status === "Interview"
  ).length;

  const hiredCandidates = candidates.filter(
    (candidate) => candidate.status === "Hired"
  ).length;

  const rejectedCandidates = candidates.filter(
    (candidate) => candidate.status === "Rejected"
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
      <h1>Recruitment Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Candidates</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalCandidates}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Applied</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "orange",
            }}
          >
            {appliedCandidates}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Interview</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {interviewCandidates}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Hired</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "green",
            }}
          >
            {hiredCandidates}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Rejected</h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "red",
            }}
          >
            {rejectedCandidates}
          </p>
        </div>
      </div>
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default RecruitmentDashboard;