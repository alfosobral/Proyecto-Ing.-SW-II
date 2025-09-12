import React from "react";

export default function Card({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 550,
        minHeight: "100vh",
        background: "rgba(15, 16, 26, 0.35)",
        padding: "35px 35px 35px 35px",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,.2)",
        fontFamily: "Montserrat",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}