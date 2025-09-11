import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordField({
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
  showPassword,
  togglePassword,
  ...props
}) {
  return (
    <div style={{ marginBottom: 14, width: "100%" }}>
      <label htmlFor={id} style={{ fontSize: 14, color: "#bababaff", marginBottom: 6, display: "block" }}>
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          style={{
            ...style,
            width: "100%",
            boxSizing: "border-box",
            paddingRight: 38,
          }}
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          tabIndex={-1}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#b6b6b6ff",
            cursor: "pointer",
            fontSize: 20,
            padding: 0,
            height: "24px",
            display: "flex",
            alignItems: "center",
          }}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {touched && error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>}
    </div>
  );
}