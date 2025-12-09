// src/routes/ManagerRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const ManagerRoute = () => {
  const { isManager, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isManager ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ManagerRoute;