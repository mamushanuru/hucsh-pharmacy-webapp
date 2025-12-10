import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

// eslint-disable-next-line react/prop-types
const Pharmacy11Route = ({ children }) => {
  const { isLoading, isLogged, isPharmacy11Admin } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isLogged || !isPharmacy11Admin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default Pharmacy11Route;
