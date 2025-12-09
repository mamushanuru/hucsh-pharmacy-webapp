const api_url = import.meta.env.VITE_REACT_APP_API_URL;

const createEmployee = async (formData) => {
  const token = localStorage.getItem('employee_token');
  const response = await fetch(`${api_url}/api/employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(formData),
  });
  return response;
};

const getEmployeeByEmail = async (email) => {
  const response = await fetch(`${api_url}/api/employee?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

const getAllEmployees = async () => {
  const token = localStorage.getItem('employee_token');
  const response = await fetch(`${api_url}/api/employees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return await response.json();
};

const getAllRoles = async () => {
  const token = localStorage.getItem('employee_token');
  const response = await fetch(`${api_url}/api/roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }
  return await response.json();
};

const updateEmployee = async (id, employeeData) => {
  const token = localStorage.getItem('employee_token');
  const response = await fetch(`${api_url}/api/employee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(employeeData),
  });
  return response;
};

const deleteEmployee = async (id) => {
  const token = localStorage.getItem('employee_token');
  const response = await fetch(`${api_url}/api/employee/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });
  return response;
};

export default {
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
  getAllRoles,
  updateEmployee,
  deleteEmployee,
};