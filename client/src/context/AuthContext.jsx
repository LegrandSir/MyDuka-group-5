import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
  if (token) {
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
   setLoading(false);
}, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);