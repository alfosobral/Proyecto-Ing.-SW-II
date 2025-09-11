import React from "react";

export default function Card({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 550,
        minHeight: "100vh",
        background: "rgba(15, 16, 26, 0.35)",
        padding: "20px 24px 40px 24px",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,.2)",
        fontFamily: "Montserrat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}