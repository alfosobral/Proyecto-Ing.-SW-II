import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

function decodeJwtExp(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || null);
  const [email, setEmail] = useState(() => sessionStorage.getItem("email") || null);

  // Auto-logout al expirar (si el JWT trae 'exp')
  useEffect(() => {
    if (!token) return;
    const exp = decodeJwtExp(token);
    if (!exp) return;

    const nowSec = Math.floor(Date.now() / 1000);
    const ms = Math.max((exp - nowSec) * 1000, 0);
    const id = setTimeout(() => logout(), ms);
    return () => clearTimeout(id);
    // eslint-disable-next-line
  }, [token]);

  const login = ({ token: newToken, email: newEmail }) => {
    setToken(newToken);
    setEmail(newEmail || null);
    sessionStorage.setItem("token", newToken);
    if (newEmail) sessionStorage.setItem("email", newEmail);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
  };

  const value = useMemo(() => ({ token, email, login, logout, isAuth: !!token }), [token, email]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
