import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:8080";
const API_BASE_URL = (() => {
  const base = import.meta?.env?.VITE_API_URL;
  if (typeof base === "string" && base.trim().length > 0) {
    return base.trim().replace(/\/$/, "");
  }
  return DEFAULT_BASE_URL;
})();

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

let authTokenProvider = () => {
  if (typeof window === "undefined") return null;
  try {
    return (
      localStorage.getItem("authToken") ||      // ← Tu login usa este
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("jwt") ||
      localStorage.getItem("jwt") ||
      null
    );
  } catch (err) {
    console.warn("Unable to read auth token from storage", err);
    return null;
  }
};

let unauthorizedHandler = null;

export function setAuthTokenProvider(provider) {
  if (typeof provider === "function") {
    authTokenProvider = provider;
  }
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
}

api.interceptors.request.use(
  (config) => {
    const token = authTokenProvider?.();
    if (token) {
      config.headers = config.headers ?? {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && unauthorizedHandler) {
      unauthorizedHandler(error);
    }
    return Promise.reject(error);
  }
);