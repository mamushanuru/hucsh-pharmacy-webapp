const api_url = import.meta.env.VITE_REACT_APP_API_URL;

// For manager to get all users
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('employee_token');
    if (!token) throw new Error('Manager authentication required');

    const response = await fetch(`${api_url}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch users');
    }

    const data = await response.json();
    return data.data || []; // Ensure we always return an array
  } catch (error) {
    console.error('UserService Error:', error);
    throw error;
  }
};

// For manager to delete users
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('employee_token');
    const response = await fetch(`${api_url}/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete user');
    }

    return true;
  } catch (error) {
    console.error('Delete User Error:', error);
    throw error;
  }
};

// For user registration (no auth required)
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${api_url}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Create User Error:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  deleteUser,
  createUser,
};