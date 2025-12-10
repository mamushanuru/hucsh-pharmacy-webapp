/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import getAuth from "../util/auth";
import { ROLES } from "../util/roles.js";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  const [employee, setEmployee] = useState(null);
  const [user, setUser] = useState(null);

  // Role states
  const [isManager, setIsManager] = useState(false);
  const [isPharmacy11Admin, setIsPharmacy11Admin] = useState(false);
  const [isPharmacy92Admin, setIsPharmacy92Admin] = useState(false);
  const [isPharmacy125Admin, setIsPharmacy125Admin] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authData = await getAuth();

        // If employee logged in
        if (authData.employee_token) {
          setIsLogged(true);

          setEmployee({
            employee_id: authData.employee_id,
            employee_first_name: authData.employee_first_name,
            employee_role: authData.employee_role,
          });

          // ROLE CHECKING
          setIsManager(authData.employee_role === ROLES.MANAGER);
          setIsPharmacy11Admin(authData.employee_role === ROLES.PHARMACY11_ADMIN);
          setIsPharmacy92Admin(authData.employee_role === ROLES.PHARMACY92_ADMIN);
          setIsPharmacy125Admin(authData.employee_role === ROLES.PHARMACY125_ADMIN);
        }

        // If user logged in
        else if (authData.user_token) {
          setIsLogged(true);

          setUser({
            user_id: authData.user_id,
            user_first_name: authData.user_first_name,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("employee_token");
        localStorage.removeItem("user_token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    isLogged,
    setIsLogged,

    employee,
    setEmployee,

    user,
    setUser,

    isManager,
    isPharmacy11Admin,
    isPharmacy92Admin,
    isPharmacy125Admin,

    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
