import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../utils/api";

const ADMIN_ROLES = ["super admin", "branch admin"];

export default function RequireAuth({ children, admin = false }) {
  const location = useLocation();
  const [status, setStatus] = useState(admin ? "loading" : "ok");

  useEffect(() => {
    if (!admin) {
      setStatus("ok");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    api
      .post("/api/admin/checkStatus")
      .then((res) => {
        if (cancelled) return;
        const role = res.data?.data?.role;
        setStatus(ADMIN_ROLES.includes(role) ? "ok" : "denied");
      })
      .catch(() => {
        if (!cancelled) setStatus("denied");
      });

    return () => {
      cancelled = true;
    };
  }, [admin]);

  if (!localStorage.getItem("token")) {
    return <Navigate to={admin ? "/admin/login" : "/user/login"} replace state={{ from: location }} />;
  }

  if (status === "loading") return null;
  if (status === "denied") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
