import React from "react";

export default function InputField({
  id,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  error,
  touched,
  style,
  type = "text",
  ...props
}) {
  return (
    <div style={{ marginBottom: 14, width: "100%" }}>
      <label htmlFor={id} style={{ fontSize: 14, color: "#bababaff", marginBottom: 6, display: "block" }}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        style={{
          ...style,
          width: "100%",
          boxSizing: "border-box",
        }}
        {...props}
      />
      {touched && error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>}
    </div>
  );
}