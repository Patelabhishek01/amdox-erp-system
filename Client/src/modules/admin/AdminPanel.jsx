import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Access denied ❌");
      navigate("/dashboard");
    }
  }, []);

  return <h1>👑 Admin Panel</h1>;
};

export default AdminPanel;