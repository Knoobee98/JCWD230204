import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children, admin = false }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={admin ? "/admin/login" : "/user/login"} replace state={{ from: location }} />;
  }

  return children;
}
