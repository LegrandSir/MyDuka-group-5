// src/services/api.js
const API_URL = "http://127.0.0.1:5000";

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const getProtected = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/auth/test-protected`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
