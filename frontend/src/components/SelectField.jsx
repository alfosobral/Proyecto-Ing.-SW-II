import React from "react";

export default function SelectField({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  error,
  touched,
  style,
  ...props
}) {
  return (
    <div style={{ marginBottom: 14, width: "100%" }}>
      <label htmlFor={id} style={{ fontSize: 14, color: "#bababaff", marginBottom: 6, display: "block" }}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          ...style,
          width: "100%",
          boxSizing: "border-box",
        }}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {touched && error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>}
    </div>
  );
}