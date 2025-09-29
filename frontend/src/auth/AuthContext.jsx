import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { setAuthTokenProvider, setUnauthorizedHandler } from "../services/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "auth_token";
const EMAIL_KEY = "auth_email";
const LEGACY_TOKEN_KEY = "jwt";
const LEGACY_EXP_KEY = "jwt_expires";

function decodeJwtExp(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function readInitialState() {
  if (typeof window === "undefined") {
    return { token: null, email: null, remember: false };
  }

  const sources = [
    { storage: window.localStorage, remember: true },
    { storage: window.sessionStorage, remember: false },
  ];

  for (const { storage, remember } of sources) {
    if (!storage) continue;
    try {
      const token = storage.getItem(TOKEN_KEY) || storage.getItem(LEGACY_TOKEN_KEY);
      if (!token) continue;

      const exp = decodeJwtExp(token);
      if (exp && exp * 1000 <= Date.now()) {
        storage.removeItem(TOKEN_KEY);
        storage.removeItem(EMAIL_KEY);
        storage.removeItem(LEGACY_TOKEN_KEY);
        if (remember) storage.removeItem(LEGACY_EXP_KEY);
        continue;
      }

      const email = storage.getItem(EMAIL_KEY);
      return { token, email, remember };
    } catch (err) {
      console.warn("Unable to read auth data from storage", err);
    }
  }

  return { token: null, email: null, remember: false };
}

function writeValue(storage, key, value) {
  if (!storage) return;
  try {
    if (value === null || value === undefined) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, String(value));
    }
  } catch (err) {
    console.warn("Unable to write auth data to storage", err);
  }
}

export function AuthProvider({ children }) {
  const initial = readInitialState();
  const [state, setState] = useState(initial);
  const tokenRef = useRef(initial.token);

  const clearStoredCredentials = useCallback(() => {
    if (typeof window === "undefined") return;
    writeValue(window.localStorage, TOKEN_KEY, null);
    writeValue(window.localStorage, EMAIL_KEY, null);
    writeValue(window.localStorage, LEGACY_TOKEN_KEY, null);
    writeValue(window.localStorage, LEGACY_EXP_KEY, null);
    writeValue(window.sessionStorage, TOKEN_KEY, null);
    writeValue(window.sessionStorage, EMAIL_KEY, null);
    writeValue(window.sessionStorage, LEGACY_TOKEN_KEY, null);
  }, []);

  const persistCredentials = useCallback((nextToken, nextEmail, remember) => {
    if (typeof window === "undefined") return;
    const primary = remember ? window.localStorage : window.sessionStorage;
    const secondary = remember ? window.sessionStorage : window.localStorage;

    writeValue(primary, TOKEN_KEY, nextToken ?? null);
    writeValue(primary, EMAIL_KEY, nextEmail ?? null);
    writeValue(secondary, TOKEN_KEY, null);
    writeValue(secondary, EMAIL_KEY, null);

    if (remember) {
      writeValue(window.sessionStorage, LEGACY_TOKEN_KEY, null);
      writeValue(window.localStorage, LEGACY_TOKEN_KEY, nextToken ?? null);
      if (nextToken) {
        const fallbackExpiry = Date.now() + 24 * 60 * 60 * 1000;
        writeValue(window.localStorage, LEGACY_EXP_KEY, fallbackExpiry);
      } else {
        writeValue(window.localStorage, LEGACY_EXP_KEY, null);
      }
    } else {
      writeValue(window.localStorage, LEGACY_TOKEN_KEY, null);
      writeValue(window.localStorage, LEGACY_EXP_KEY, null);
      writeValue(window.sessionStorage, LEGACY_TOKEN_KEY, nextToken ?? null);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredCredentials();
    setState({ token: null, email: null, remember: false });
  }, [clearStoredCredentials]);

  const login = useCallback(
    ({ token: newToken, email: newEmail, remember = false }) => {
      if (!newToken) {
        console.warn("Auth login called without token");
        return;
      }
      persistCredentials(newToken, newEmail ?? null, remember);
      setState({ token: newToken, email: newEmail ?? null, remember });
    },
    [persistCredentials]
  );

  const { token, email, remember } = state;

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    const provider = () => tokenRef.current;
    setAuthTokenProvider(provider);

    const handleUnauthorized = () => logout();
    setUnauthorizedHandler(handleUnauthorized);

    return () => {
      setAuthTokenProvider(() => null);
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  useEffect(() => {
    if (!token) return;
    const exp = decodeJwtExp(token);
    if (!exp) return;

    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(logout, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [token, logout]);

  const value = useMemo(
    () => ({
      token,
      email,
      remember,
      login,
      logout,
      isAuth: Boolean(token),
    }),
    [token, email, remember, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}