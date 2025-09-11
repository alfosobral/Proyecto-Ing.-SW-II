import React from "react";

export default function CheckboxField({ id, label, checked, onChange, error }) {
  return (
    <label style={{ fontSize: 14, color: "#bababaff", display: "flex", gap: 8, alignItems: "center" }}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      {label}
      {error && <span style={{ color: "#dc2626", fontSize: 13, marginLeft: 8 }}>{error}</span>}
    </label>
  );
}