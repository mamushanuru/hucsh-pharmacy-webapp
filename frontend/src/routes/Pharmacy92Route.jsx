import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

// eslint-disable-next-line react/prop-types
const Pharmacy92Route = ({ children }) => {
  const { isLoading, isLogged, isPharmacy92Admin } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isLogged || !isPharmacy92Admin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default Pharmacy92Route;
