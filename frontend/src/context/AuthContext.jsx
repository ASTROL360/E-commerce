import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("fashionStoreToken") || "");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("fashionStoreUser") || "null"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("fashionStoreToken", token);
    } else {
      localStorage.removeItem("fashionStoreToken");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("fashionStoreUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("fashionStoreUser");
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    const auth = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const userData = { name: auth.name, email: auth.email, role: auth.role };
    localStorage.setItem("fashionStoreToken", auth.token);
    localStorage.setItem("fashionStoreUser", JSON.stringify(userData));
    setToken(auth.token);
    setUser(userData);
    return auth;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const auth = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    const userData = { name: auth.name, email: auth.email, role: auth.role };
    localStorage.setItem("fashionStoreToken", auth.token);
    localStorage.setItem("fashionStoreUser", JSON.stringify(userData));
    setToken(auth.token);
    setUser(userData);
    return auth;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fashionStoreToken");
    localStorage.removeItem("fashionStoreUser");
    setToken("");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
