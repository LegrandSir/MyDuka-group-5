import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // 👇 Rehydrate user from token on refresh
  useEffect(() => {
    if (token && !user) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token:", decoded);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);