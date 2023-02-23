import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

function ProtectedUserRoute() {
  const { user, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/login");

    if (isAdmin) return navigate("/");
  }, [navigate, user, isAdmin]);

  return <Outlet />;
}

export default ProtectedUserRoute;
