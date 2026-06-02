import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaCalendarCheck,
  FaPlaneDeparture,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const hrMenuItems = [
  {
    name: "Employees",
    path: "/employees",
    icon: <FaUsers />,
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: <FaCalendarCheck />,
  },
  {
    name: "Leave Management",
    path: "/leaves",
    icon: <FaPlaneDeparture />,
  },
  {
    name: "Payroll",
    path: "/payroll",
    icon: <FaMoneyCheckAlt />,
  },
];

export default function HRSubNav() {
  return (
    <div className="sub-nav">
      {hrMenuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `sub-nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sub-nav-icon">
            {item.icon}
          </span>
          <span>{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}