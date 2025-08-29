import { useState, useMemo } from "react";

const initial = { name: "", secondName: "", document:"", email: "", password: "", confirm: "", accept: false };

export default function Register({ width = 420 }) {
  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState(null);

  const errors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(errors).length === 0 && form.accept;

  function onChange(e) {
    const { name, type, value, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function onBlur(e) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    // Acá harías la llamada a tu API (fetch/axios)
    console.log("Registrando usuario:", form);
    alert("✅ Registro enviado (ver consola)");
  }

  const strength = passwordStrength(form.password);

  return (
    <form onSubmit={onSubmit} style={styles.card}>
      <h1 style={styles.title}>Crea tu cuenta</h1>

      {/* Nombre */}
      <div style={styles.field}>
        <label style={styles.label} htmlFor="name">Nombre</label>
        <input
          id="name" name="name" value={form.name} 
          onChange={onChange} onBlur={onBlur}
          onFocus={() => setFocused("name")} onBlurCapture={() => setFocused(null)}
          placeholder="Tu nombre"
          style={inputStyle(touched.name && errors.name, focused === "name")}
        />
        {touched.name && errors.name && <p style={styles.error}>{errors.name}</p>}
      </div>

      {/* Apellido */}
      <div style={styles.field}>
        <label style={styles.label} htmlFor="secondName">Apellido</label>
        <input
          id="secondName" name="secondName" value={form.secondName} 
          onChange={onChange} onBlur={onBlur}
          onFocus={() => setFocused("secondName")} onBlurCapture={() => setFocused(null)}
          placeholder="Tu apellido"
          style={inputStyle(touched.secondName && errors.secondName, focused === "secondName")}
        />
        {touched.secondName && errors.secondName && <p style={styles.error}>{errors.secondName}</p>}
      </div>

      {/* Documento */}
      <div style={styles.field}>
        <label style={styles.label} htmlFor="document">Documento</label>
        <input
          id="document" name="document" value={form.document} 
          onChange={onChange} onBlur={onBlur}
          onFocus={() => setFocused("document")} onBlurCapture={() => setFocused(null)}
          placeholder="Documento (CI)"
          style={inputStyle(touched.document && errors.document, focused === "document")}
        />
        {touched.document && errors.document && <p style={styles.error}>{errors.document}</p>}
      </div>

      {/* Email */}
      <div style={styles.field}>
        <label style={styles.label} htmlFor="email">Email</label>
        <input
          id="email" name="email" value={form.email} 
          onChange={onChange} onBlur={onBlur}
          onFocus={() => setFocused("email")} onBlurCapture={() => setFocused(null)}
          placeholder="tu@email.com"
          style={inputStyle(touched.email && errors.email, focused === "email")}
        />
        {touched.email && errors.email && <p style={styles.error}>{errors.email}</p>}
      </div>

      {/* Password */}
      <div style={styles.field}>
        <label style={styles.label} htmlFor="password">Contraseña</label>
        <input
          id="password" name="password" type="password"
          value={form.password} 
          onChange={onChange} onBlur={onBlur}
          onFocus={() => setFocused("password")} onBlurCapture={() => setFocused(null)}
          placeholder="••••••••"
          style={inputStyle(touched.password && errors.password, focused === "password")}
        />
        <div style={styles.meterWrap} aria-hidden>
          <div style={{ ...styles.meterBar, width: `${strength.score * 25}%` }} />
        </div>
        <small style={styles.meterText}>{strength.label}</small>
        {touched.password && errors.password && <p style={styles.error}>{errors.password}</p>}
      </div>

      {/* Confirm */}
      <div style={styles.field}>
        <label style={styles.label} htmlFor="confirm">Confirmar contraseña</label>
        <input
          id="confirm" name="confirm" type="password"
          value={form.confirm} 
          onChange={onChange} onBlur={onBlur}
          onFocus={() => setFocused("confirm")} onBlurCapture={() => setFocused(null)}
          placeholder="Repite la contraseña"
          style={inputStyle(touched.confirm && errors.confirm, focused === "confirm")}
        />
        {touched.confirm && errors.confirm && <p style={styles.error}>{errors.confirm}</p>}
      </div>

      {/* Términos */}
      <label style={{ ...styles.label, display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" name="accept" checked={form.accept} onChange={onChange} />
        Acepto los términos y condiciones
      </label>
      {!form.accept && <small style={{ color: "#94a3b8" }}>Debes aceptar para continuar</small>}

      <button type="submit" disabled={!isValid} style={buttonStyle(!isValid)}>
        Crear cuenta
      </button>
    </form>
  );
}

function validate(f) {
  const errs = {};
  if (!f.name.trim()) errs.name = "El nombre es obligatorio.";
  if (!f.secondName.trim()) errs.secondName = "El apellido es obligatorio.";
  if (!isValidDocument(f.document)) errs.document = "El documento es inválido (8 digit)."
  if (!isValidEmail(f.email)) errs.email = "Email inválido.";
  if (f.password.length < 8) errs.password = "Mínimo 8 caracteres.";
  if (!/[A-Z]/.test(f.password)) errs.password ??= "Incluye al menos una mayúscula.";
  if (!/[0-9]/.test(f.password)) errs.password ??= "Incluye al menos un número.";
  if (f.confirm !== f.password) errs.confirm = "Las contraseñas no coinciden.";
  return errs;
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidDocument(s) {
  return /^[0-9]{8}$/.test(s);
}

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"];
  return { score, label: labels[score] };
}

const styles = {
  card: {
    width: "100%", maxWidth: 420, background: "white",
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 24,
    paddingRight: 48, 
    borderRadius: 16, 
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
    fontFamily: "Montserrat"
  },
  title: { margin: 0, marginBottom: 12, fontSize: 28, color: "#000000ff" },
  field: { marginBottom: 14 },
  label: { fontSize: 14, color: "#334155", marginBottom: 6, display: "block" },
  error: { color: "#dc2626", fontSize: 13, marginTop: 6 },
  meterWrap: { height: 6, background: "#e2e8f0", borderRadius: 999, marginTop: 6 },
  meterBar: { height: "100%", background: "#3b82f6", borderRadius: 999, transition: "width .25s" },
  meterText: { color: "#475569", fontSize: 12, display: "block", marginTop: 6 }
};

function inputStyle(isError, isFocused) {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${isError ? "#ef4444" : isFocused ? "#2563eb" : "#cbd5e1"}`,
    outline: "none",
    fontSize: 14,
    transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
    transform: isFocused ? "scale(1.02)" : "scale(1)",
    boxShadow: isFocused ? "0 0 0 3px rgba(37,99,235,.15)" : "none",
    background: "white",
  };
}


function buttonStyle(disabled) {
  return {
    marginTop: 12, width: "100%", padding: "12px 14px",
    borderRadius: 10, border: "none",
    background: disabled ? "#cbd5e1" : "#30a5e8ff",
    color: "white", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    transition: "filter .2s"
  };
}
