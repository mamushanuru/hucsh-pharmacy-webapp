// src/services/role.service.js
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAllRoles = async () => {
  try {
    const response = await fetch(`${API_URL}/api/roles`);
    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export default {
  getAllRoles,
};