

import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  return(
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
     <h1>⚙️ Settings Page</h1>
     <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  )
};

export default Settings;