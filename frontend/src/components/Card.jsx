import React from "react";

export default function Card({ children, style }) {
  return (
    <div
      style={{
        width: "45vw",
        //maxWidth: 550,
        minHeight: "100vh",
        background: "hsla(0, 8%, 87%, 0.40)",
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