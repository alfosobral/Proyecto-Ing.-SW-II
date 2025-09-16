import React from "react";

// Lista de países con código y bandera (puedes agregar más)
const countries = [
  { code: "+598", name: "Uruguay", flag: "🇺🇾" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+55", name: "Brasil", flag: "🇧🇷" },
  { code: "+1", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "+34", name: "España", flag: "🇪🇸" },
];

export default function PhoneField({ value, onChange, countryCode, onCountryChange, ...props }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select
        value={countryCode}
        onChange={e => onCountryChange(e.target.value)}
        style={{ fontSize: 16, padding: "6px 8px", borderRadius: 8 }}
      >
        {countries.map(c => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code} ({c.name})
          </option>
        ))}
      </select>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Número de teléfono"
        style={{ fontSize: 16, padding: "8px 12px", borderRadius: 8, width: 180 }}
        maxLength={12}
        {...props}
      />
    </div>
  );
}
