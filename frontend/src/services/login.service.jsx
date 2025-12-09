const api_url = import.meta.env.VITE_REACT_APP_API_URL;
// Update login.service.jsx
const logIn = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };

  try {
    const response = await fetch(`${api_url}/api/employee/login`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.status === "success") {
      localStorage.setItem("employee_token", data.data.employee_token);
      localStorage.setItem("employee_id", data.data.employee_id);
      localStorage.setItem("employee_first_name", data.data.employee_first_name);
      localStorage.setItem("employee_role", data.data.employee_role);
      
      return {
        status: "success",
        data: data.data
      };
    }

    throw new Error(data.message || "Login failed");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
const logOut = () => {
  localStorage.removeItem("employee");
};
// Export the functions
const loginService = {
  logIn,
  logOut,
};
export default loginService;
