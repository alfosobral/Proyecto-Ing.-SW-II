import React from "react";
import { FaStar } from "react-icons/fa";
import Card from "./Card";

export default function ServiceCard({ image, rating, name, description, onClick }) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const rounded = Math.round(safeRating * 10) / 10; // 4.3, 4.8, etc.

  return (
    <Card
      style={{
        minHeight: "auto",           // 👈 sobreescribe el 100vh del Card base
        padding: 16,
        gap: 12,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      {/* Imagen */}
      <div style={{ width: "100%", position: "relative", overflow: "hidden", borderRadius: 10 }}>
        <img
          src={image || "/placeholder-service.jpg"}
          alt={name ? `Foto de ${name}` : "Servicio"}
          style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
          loading="lazy"
        />
      </div>

      {/* Título + rating */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <h3 style={{ margin: 0, color: "#fff", fontSize: 18, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaStar style={{ color: "#facc15" }} />
          <span style={{ color: "#e5e7eb", fontSize: 14 }}>{rounded.toFixed(1)}</span>
        </div>
      </div>

      {/* Descripción (una línea) */}
      <p
        title={description}
        style={{
          margin: 0,
          color: "#cbd5e1",
          fontSize: 14,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {description}
      </p>
    </Card>
  );
}
