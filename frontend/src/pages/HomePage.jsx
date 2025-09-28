import Navbar from "../components/Navbar";
import React, { useState } from "react";
import Card from "../components/Card";
import InputField from "../components/InputField";
import ServiceCard from "../components/ServiceCard";
import background from "../assets/WhatsApp Image 2025-09-26 at 08.54.03_6362b8ae.jpg";


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
                flexDirection: "column",
                padding: "40px 0",
                background: "#ffffffff",
                backgroundImage: `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.15)), url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <Navbar />

            {/* Contenedor de las tarjetas */}
            <div
                style={{
                display: "grid",
                alignItems: "center",
                gridTemplateColumns: "repeat(3, 1fr)", // 4 columnas iguales
                gap: "40px",                        // espacio horizontal y vertical
                padding: "80px 40px",                    // margen superior para que no choque con la navbar
                justifyContent: "center",
                }}
            >
                {/* Render de ejemplo: reemplaza con tu data real */}
                {Array.from({ length: 12 }).map((_, i) => (
                <ServiceCard key={i} /* props={...} */ />
                ))}
            </div>

        </div>
    );
}