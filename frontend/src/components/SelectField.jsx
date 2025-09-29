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
  arrowOffset = 10, 
  ...props
}) {
  const [focused, setFocused] = React.useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const borderColor = error ? "#ef4444" : focused ? "#42b3fd" : "#cbd5e1";

  return (
    <div style={{ marginBottom: 14, width: "100%" }}>
      {label && (
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
      )}

      {/* Wrapper relativo para colocar la flecha */}
      <div style={{ position: "relative", width: "100%" }}>
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            width: "100%",
            padding: "10px 40px 10px 12px", 
            borderRadius: 12,
            border: `4px solid ${borderColor}`,
            outline: "none",
            fontSize: 14,
            transition:
              "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
            transform: focused ? "scale(1.02)" : "scale(1)",
            boxShadow: focused ? "0 0 0 5px rgba(37,99,235,.15)" : "none",
            background: "#ffffff77",
            boxSizing: "border-box",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundImage: "none",
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Flecha custom */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            right: `${arrowOffset}px`, 
            transform: "translateY(-50%)",
            pointerEvents: "none", 
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            opacity: 0.9,
          }}
        >
          {/* SVG caret */}
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 10l5 5 5-5" stroke="#1f2937" strokeWidth="2" />
          </svg>
        </span>
      </div>

      {touched && error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}
