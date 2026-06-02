// import { Navigate } from "react-router-dom";

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// export default PrivateRoute;


import { Navigate, useLocation } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";

function PrivateRoute({
  children,
  allowedRoles = [],
}) {
  const token = getToken();
  const role = getRole();

  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "Please login first",
        }}
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          unauthorized: true,
        }}
      />
    );
  }

  return children;
}

export default PrivateRoute;