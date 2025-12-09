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
          setIsManager(authData.employee_role === 1);
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