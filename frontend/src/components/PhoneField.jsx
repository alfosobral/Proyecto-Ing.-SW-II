import React from "react";

const countries = [
  { code: "+598", name: "Uruguay", flag: "🇺🇾" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+55", name: "Brasil",    flag: "🇧🇷" },
  { code: "+1",  name: "Estados Unidos", flag: "🇺🇸" },
  { code: "+34", name: "España",    flag: "🇪🇸" },
];

export default function PhoneField({
  id,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  error,
  touched,
  onCountryChange,
  selectedCountry = "+598",
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: 0,
          borderRadius: 12,
          border: `4px solid ${error ? "#ef4444" : focused ? "#42b3fd" : "#cbd5e1"}`,
          outline: "none",
          background: "#ffffff77",
          boxSizing: "border-box",
          transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
          transform: focused ? "scale(1.02)" : "scale(1)",
          boxShadow: focused ? "0 0 0 5px rgba(37,99,235,.15)" : "none",
          overflow: "hidden",
        }}
      >
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange?.(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            border: "none",
            outline: "none",
            background: "white",
            padding: "10px 8px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>

        <input
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          type="text"
          maxLength={8}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "10px 12px",
            fontSize: 14,
            background: "ffffff77",
            boxSizing: "border-box",
          }}
          {...props}
        />
      </div>

      {touched && error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}
