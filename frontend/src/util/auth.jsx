const decodeTokenPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const getAuth = async () => {
  const employeeToken = localStorage.getItem('employee_token');
  if (employeeToken) {
    const decoded = decodeTokenPayload(employeeToken);
    if (!decoded) {
      localStorage.removeItem('employee_token');
      return {};
    }
    return {
      employee_token: employeeToken,
      employee_id: decoded.employee_id,
      employee_first_name: decoded.employee_first_name,
      employee_role: decoded.employee_role
    };
  }

  const userToken = localStorage.getItem('user_token');
  if (userToken) {
    const decoded = decodeTokenPayload(userToken);
    if (!decoded) {
      localStorage.removeItem('user_token');
      return {};
    }
    return {
      user_token: userToken,
      user_id: decoded.user_id,
      user_first_name: decoded.user_first_name,
    };
  }

  return {};
};

export default getAuth;

