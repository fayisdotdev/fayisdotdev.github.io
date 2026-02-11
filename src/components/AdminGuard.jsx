import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }) => {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_access");

    if (saved === "true") {
      setAllowed(true);
      return;
    }

    const input = window.prompt("Enter admin secret key:");

    if (
      input &&
      input === import.meta.env.VITE_ADMIN_SECRET
    ) {
      sessionStorage.setItem("admin_access", "true");
      setAllowed(true);
    } else {
      setAllowed(false);
    }
  }, []);

  if (allowed === null) return null;

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminGuard;
