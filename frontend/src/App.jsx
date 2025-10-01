import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./pages/LogIn";
import HomePage from "./pages/HomePage";
import ServicePost from "./pages/ServicePost";
import ServicePost2 from "./pages/ServicePost2"
import Profile from "./pages/Profile";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home_page" element={<HomePage />} />
          <Route path="/service_post" element={<ServicePost />} /> 
          <Route path="/service_post2" element={<ServicePost2 />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;