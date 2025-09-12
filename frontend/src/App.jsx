import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./pages/LogIn";
import MainPage from "./pages/MainPage"
import ServicePost from "./pages/ServicePost";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main_page" element={<MainPage />} />
        <Route path="/service_post" element={<ServicePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
