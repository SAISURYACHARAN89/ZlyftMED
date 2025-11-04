import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role"); // persist role
    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          setUser({ ...res.data, role: savedRole || "hospital" });
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      // Check for hardcoded admin
      let role = "hospital";
      if (email === "admin@gmail.com" && password === "admin@123") {
        role = "admin";
      }

      localStorage.setItem("role", role);
      setUser({ ...res.data.user, role });
      return { ...res.data.user, role };
    } catch (err) {
      if (err.response?.status === 401) {
        throw new Error("Invalid credentials");
      }
      throw new Error("An error occurred during login");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
