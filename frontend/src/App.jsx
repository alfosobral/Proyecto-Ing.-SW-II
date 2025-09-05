import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./pages/LogIn";
import MainPage from "./pages/MainPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/main_page" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
