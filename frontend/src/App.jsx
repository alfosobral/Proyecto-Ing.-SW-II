import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LogIn from "./pages/LogIn";
import HomePage from "./pages/HomePage"
import ServicePost from "./pages/ServicePost";
import Profile from "./pages/Profile";
import { useEffect } from "react";


function App() {
  // Verificación global de expiración de token
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const expiresAt = localStorage.getItem("jwt_expires");
    if (token && expiresAt && Date.now() > Number(expiresAt)) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("jwt_expires");
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      window.location.href = "/login";
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home_page" element={<HomePage />} />
        <Route path="/service_post" element={<ServicePost />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
