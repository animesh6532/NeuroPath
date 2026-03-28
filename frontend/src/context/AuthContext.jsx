import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(false);
    } else {
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
    }
  }, [token]);

  const login = (jwtToken, userData = null) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      const fallbackUser = { loggedIn: true };
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};