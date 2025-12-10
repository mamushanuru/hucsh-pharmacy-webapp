import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

// eslint-disable-next-line react/prop-types
const Pharmacy125Route = ({ children }) => {
  const { isLoading, isLogged, isPharmacy125Admin } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isLogged || !isPharmacy125Admin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default Pharmacy125Route;
