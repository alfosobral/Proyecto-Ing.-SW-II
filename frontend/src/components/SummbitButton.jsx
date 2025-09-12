import React from "react";

/**
 * Botón de envío reutilizable.
 * - Mantiene tu estilo original.
 * - Soporta disabled + loading (evita doble click/submit).
 * - Accesible: aria-busy, aria-disabled.
 * - Permite íconos opcionales a izquierda/derecha.
 * - Permite variantes básicas (por si después querés más de un color).
 */
export default function SubmitButton({
  children,
  type = "submit",
  disabled = false,
  loading = false,
  onClick,
  fullWidth = true,
  variant = "primary",
  leftIcon = null,
  rightIcon = null,
  style,
  className,
  ariaLabel,
}) {
  const isDisabled = disabled || loading;

  // Paleta simple por si luego querés otras variantes
  const palette = {
    primary: {
      bg: "#2563eb",
      bgDisabled: "#cbd5e1",
      fg: "#fff",
      fgDisabled: "#64748b",
    },
  };

  const c = palette[variant] ?? palette.primary;

  const baseStyle = {
    width: fullWidth ? "100%" : undefined,
    marginTop: 18,
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: isDisabled ? c.bgDisabled : c.bg,
    color: isDisabled ? c.fgDisabled : c.fg,
    fontWeight: 700,
    fontSize: 16,
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "background .2s, opacity .2s, transform .05s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: loading ? 0.95 : 1,
    ...style,
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading ? "true" : undefined}
      aria-disabled={isDisabled ? "true" : undefined}
      className={className}
      style={baseStyle}
    >
      {loading ? <Spinner color={c.fg} /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}

/** Spinner SVG sin CSS externo (usa animateTransform de SVG) */
function Spinner({ size = 18, color = "#fff" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="sb_grad">
          <stop stopColor={color} stopOpacity="0" offset="0%" />
          <stop stopColor={color} stopOpacity=".631" offset="63.146%" />
          <stop stopColor={color} offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)">
          <path d="M36 18c0-9.94-8.06-18-18-18" stroke="url(#sb_grad)" strokeWidth="3">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
          <circle stroke={color} strokeOpacity=".2" cx="18" cy="18" r="18" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}
