/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import getAuth from '../util/auth';

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isPharmacy11Admin, setIsPharmacy11Admin] = useState(false);
  const [isPharmacy92Admin, setIsPharmacy92Admin] = useState(false);
  const [isPharmacy125Admin, setIsPharmacy125Admin] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authData = await getAuth();
        
        if (authData.employee_token) {
          setIsLogged(true);
          setEmployee({
            employee_id: authData.employee_id,
            employee_first_name: authData.employee_first_name,
            employee_role: authData.employee_role
          });
          
          // Set role states
          setIsManager(authData.employee_role === 1);
          setIsPharmacy11Admin(authData.employee_role === 2);
          setIsPharmacy92Admin(authData.employee_role === 3);
          setIsPharmacy125Admin(authData.employee_role === 4);
        } else if (authData.user_token) {
          setIsLogged(true);
          setUser({
            user_id: authData.user_id,
            user_first_name: authData.user_first_name
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem('employee_token');
        localStorage.removeItem('user_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    isLogged,
    setIsLogged,
    isManager,
    isPharmacy11Admin,
    isPharmacy92Admin,
    isPharmacy125Admin,
    employee,
    setEmployee,
    user,
    setUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};