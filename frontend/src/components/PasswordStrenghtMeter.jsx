import React from "react";

export default function PasswordStrengthMeter({ score, label }) {
  return (
    <>
      <div style={{ height: 6, background: "#e2e8f0", borderRadius: 999, marginTop: 6 }}>
        <div style={{
          height: "100%",
          background: "#3b82f6",
          borderRadius: 999,
          transition: "width .25s",
          width: `${score * 25}%`
        }} />
      </div>
      <small style={{ color: "#677384ff", fontSize: 12, display: "block", marginTop: 6 }}>{label}</small>
    </>
  );
}