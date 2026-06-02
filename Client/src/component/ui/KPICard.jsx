import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function KPICard({
  title,
  value,
  icon,
  trend = "up",
  change = "0%",
  subtitle = "vs last month",
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <div>
          <p className="kpi-title">{title}</p>
          <h3 className="kpi-value">{value}</h3>
        </div>

        <div className="kpi-icon">{icon}</div>
      </div>

      <div className={`kpi-trend ${trend}`}>
        {trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
        <span>{change}</span>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}