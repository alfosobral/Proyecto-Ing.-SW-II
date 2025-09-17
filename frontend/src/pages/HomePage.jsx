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
                background: "#00040eff"
            }}
        >
            <Navbar />
            {/* Botón de perfil arriba a la derecha */}
            <div style={{ position: "fixed", top: 20, right: 30, zIndex: 100 }}>
                <button onClick={() => setShowProfile(s => !s)} style={{ padding: "8px 16px", borderRadius: 8, background: "#42b3fd", color: "#fff", fontWeight: 600, border: "none", cursor: "pointer" }}>
                    Perfil
                </button>
                {showProfile && (
                    <div style={{ position: "absolute", top: 40, right: 0, background: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: 16, minWidth: 220 }}>
                        <p><strong>Email:</strong> {userEmail}</p>
                        {/* Agrega aquí más datos si los tienes en el token */}
                        <button onClick={() => {
                            localStorage.removeItem("jwt");
                            localStorage.removeItem("jwt_expires");
                            sessionStorage.removeItem("jwt");
                            window.location.href = "/login";
                        }} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, background: "#dc2626", color: "#fff", fontWeight: 600, border: "none", cursor: "pointer" }}>
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}