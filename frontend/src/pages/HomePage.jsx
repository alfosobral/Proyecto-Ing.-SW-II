import Navbar from "../components/Navbar";
import React, { useState } from "react";
import Card from "../components/Card";
import InputField from "../components/InputField";
import ServiceCard from "../components/ServiceCard";


export default function HomePage() {

    const [showProfile, setShowProfile] = useState(false);
    // Obtener datos del usuario del token
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    let userEmail = "";
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userEmail = payload.sub || payload.email || "";
      }
    } catch {}

    return (
        <div 
            style={{ 
                minHeight: "100vh",
                display: "flex",
                alignItems: "flex-start",
                padding: "40px 0",
                background: "#06112eff"
            }}
        >
            <Navbar />
        </div>
    );
}