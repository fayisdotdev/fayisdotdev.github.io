import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ADMIN_EMAILS = ["fayiz14921@gmail.com"];

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && ADMIN_EMAILS.includes(user.email)) {
        setAllowed(true);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Checking access...</div>;
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
