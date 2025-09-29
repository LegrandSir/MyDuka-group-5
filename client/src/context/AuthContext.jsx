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


  useEffect(() => {
  if (token && !user) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));


      const normalizedUser = {
        id: decoded.sub?.user_id,
        role: decoded.sub?.role,
        ...decoded
      };

      setUser(normalizedUser);
    } catch (err) {
      console.error("Token invalid", err);
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