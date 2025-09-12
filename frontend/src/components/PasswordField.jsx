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
  showPassword,
  togglePassword,
  ...props
}) {
  const [focused, setFocused] = React.useState(false);

  const handleFocus = e => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  const handleBlur = e => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div style={{ marginBottom: 14, width: "100%" }}>
      <label
        htmlFor={id}
        style={{
          fontSize: 14,
          color: "#bababaff",
          marginBottom: 6,
          display: "block",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "10px 38px 10px 12px", // padding-right para el icono
            borderRadius: 10,
            border: `4px solid ${error ? "#ef4444" : focused ? "#2563eb" : "#cbd5e1"}`,
            outline: "none",
            fontSize: 14,
            transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
            transform: focused ? "scale(1.02)" : "scale(1)",
            boxShadow: focused ? "0 0 0 5px rgba(37,99,235,.15)" : "none",
            background: "white",
            boxSizing: "border-box",
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
      {touched && error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}