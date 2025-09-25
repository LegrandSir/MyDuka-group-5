// src/services/api.js
const API_URL = "http://localhost:5000";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Login API error:', error);
    throw error; // Re-throw to be handled by the calling component
  }
};

export const getDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/auth/test-protected`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Dashboard API error:', error);
    throw error;
  }
};