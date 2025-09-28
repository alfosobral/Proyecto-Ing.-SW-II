import React from "react";

export default function DateField({
  id,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  error,
  touched,
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
          color: "#ffffffff",
          marginBottom: 6,
          display: "block",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: `4px solid ${error ? "#ef4444" : focused ? "#42b3fd" : "#cbd5e1"}`,
          outline: "none",
          fontSize: 14,
          transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
          transform: focused ? "scale(1.02)" : "scale(1)",
          boxShadow: focused ? "0 0 0 5px rgba(37,99,235,.15)" : "none",
          background: "#ffffff77",
          boxSizing: "border-box",
        }}
        {...props}
      />
      {touched && error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}