import Navbar from "../components/Navbar";
import React, { useState } from "react";
import Card from "../components/Card";
import InputField from "../components/InputField";
import ServiceCard from "../components/ServiceCard";
import background from "../assets/Background.png";

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

            {/* Contenedor principal para centrar todo */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center", // Centra horizontalmente
                    alignItems: "center",     // Centra verticalmente
                    flex: 1,                  // Ocupa todo el espacio restante
                    width: "100%",
                    padding: "40px",
                }}
            >
                {/* Contenedor de las tarjetas */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)", // 3 columnas iguales
                        gap: "5vw",                           // espacio entre tarjetas
                        maxWidth: "1200px",                    // Ancho máximo del grid
                        width: "100%",                         // Usar todo el ancho disponible
                        padding: "80px 40px",
                        justifyItems: "center",                // Centra cada tarjeta en su celda
                    }}
                >
                    {/* Render de ejemplo: reemplaza con tu data real */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <ServiceCard key={i} /* props={...} */ />
                    ))}
                </div>
            </div>
        </div>
    );
}