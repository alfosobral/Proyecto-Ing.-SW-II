import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import back1 from "../assets/blacksmith.png";
import back2 from "../assets/carpenter.png";
import back3 from "../assets/painter.png";
import logoImg from "../assets/Logo.png";

const SERVICES = ["Plomería", "Electricidad", "Carpintería", "Herrería", "Pintura", "Jardinería"];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

// ---------- Validación por paso ----------
function validate(form, step) {
  const errs = {};
  if (step === 0) {
    if (form.services.length === 0) errs.services = "El servicio es obligatorio (seleccioná al menos uno).";
    if (!form.years) errs.years = "Los años de experiencia son obligatorios.";
    if (!form.about.trim()) errs.about = "La descripción es obligatoria.";
  }
  if (step === 1) {
    if (!String(form.rate).trim()) errs.rate = "La tarifa es obligatoria.";
    if (!Object.values(form.shifts).some(Boolean)) errs.shifts = "Seleccioná al menos un horario.";
  }
  if (step === 2) {
    if (!form.ciFront) errs.ciFront = "Debes tomar la foto del frente de la cédula.";
    if (!form.ciBack) errs.ciBack = "Debes tomar la foto del reverso de la cédula.";
  }
  return errs;
}

export default function ServiceProvider() {
  const [step, setStep] = useState(0);
  const [dir, setDirection] = useState(1);

  const backgrounds = [back1, back2, back3];

  // ---------- Estado del formulario ----------
  const [form, setForm] = useState({
    services: [],
    years: 0,
    about: "",
    rate: "",
    shifts: { manana: false, tarde: false, noche: false, madrugada: false },
    ciFront: null,
    ciBack: null,
    portfolio: [],
  });
  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const [touched, setTouched] = useState({});
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const errors = useMemo(() => validate(form, step), [form, step]);
  const canNext = Object.keys(errors).length === 0;

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, 2)); setTouched({}); };
  const back = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); setTouched({}); };

  return (
    <div style={styles.page}>
      {/* Fondo animado */}
      <div style={styles.bgWrapper}>
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.img
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeOut" }}
            src={backgrounds[step]}
            alt=""
            style={{
              ...styles.bgImg,
              transform: "scale(0.50)", // alejás el fondo (ajustá si querés)
            }}
          />
        </AnimatePresence>
      </div>

      {/* Card */}
      <div style={styles.cardPane}>
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={styles.card}
          >
            <div style={styles.logo}>
              <img src={logoImg} alt="Logo HurryHand" style={{ height: 80, display: "block", margin: "0 auto" }} />
            </div>
            <Progress current={step} total={3} />

            {step === 0 && (
              <Step1
                form={form}
                onChange={onChange}
                errors={errors}
                touched={touched}
                markTouched={markTouched}
              />
            )}
            {step === 1 && (
              <Step2
                form={form}
                onChange={onChange}
                errors={errors}
                touched={touched}
                markTouched={markTouched}
              />
            )}
            {step === 2 && (
              <Step3
                form={form}
                onChange={onChange}
                errors={errors}
                touched={touched}
                markTouched={markTouched}
              />
            )}

            <div style={styles.footer}>
              <button onClick={back} disabled={step === 0} style={styles.btnGhost}>
                Atrás
              </button>
              <button
                onClick={step === 2 ? () => alert("✅ Publicado (demo)") : next}
                disabled={!canNext}
                style={styles.btnPrimary}
              >
                {step === 2 ? "Publicar perfil" : "Siguiente"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Progress({ current, total }) {
  return (
    <div style={styles.progressRow}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.dot,
            background: i === current ? "#4cc0ff" : "rgba(255,255,255,0.15)",
            borderColor: i <= current ? "#4cc0ff" : "rgba(255,255,255,0.35)",
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

/* ---------- Helpers visuales reutilizables ---------- */
function boxStyle({ hovered, checked }) {
  return {
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: checked
      ? "rgba(46,163,255,0.14)"
      : hovered
      ? "rgba(255,255,255,0.10)"
      : "rgba(255,255,255,0.06)",
    border: `1px solid ${
      checked ? "#2ea3ff" : hovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.24)"
    }`,
    padding: "10px 12px",
    borderRadius: 10,
    userSelect: "none",
    cursor: "pointer",
    transform: hovered ? "translateY(-1px)" : "none",
    boxShadow: (hovered || checked) ? "0 0 0 5px rgba(46,163,255,0.15)" : "none",
    transition: "all .15s ease",
  };
}

function inputStyle({ focused }) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: focused ? "1px solid #2ea3ff" : "1px solid rgba(255,255,255,0.24)",
    background: focused ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
    boxShadow: focused ? "0 0 0 5px rgba(46,163,255,0.15)" : "none",
    transition: "all .15s ease",
  };
}

/* ---------- Paso 1: Servicios + Años + Acerca de ti ---------- */
function Step1({ form, onChange, errors, touched, markTouched }) {
  const [hoverService, setHoverService] = useState(null);
  const [focusField, setFocusField] = useState(null);

  const toggleService = (service) => {
    const checked = form.services.includes(service);
    const next = checked ? form.services.filter((s) => s !== service) : [...form.services, service];
    onChange("services", next);
    markTouched("services");
  };

  return (
    <div>
      <h2 style={styles.title}>Cuéntanos de ti</h2>

      <label style={styles.label}>Servicios</label>
      <div style={styles.servicesGrid}>
        {SERVICES.map((s) => {
          const checked = form.services.includes(s);
          const hovered = hoverService === s;
          return (
            <label
              key={s}
              style={boxStyle({ hovered, checked })}
              onMouseEnter={() => setHoverService(s)}
              onMouseLeave={() => setHoverService(null)}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleService(s)}
                onBlur={() => markTouched("services")}
              />
              <span>{s}</span>
            </label>
          );
        })}
      </div>
      {touched.services && errors.services && <p style={styles.error}>{errors.services}</p>}

      <label style={styles.label}>Años de experiencia</label>
      <input
        type="number"
        min="1"
        step="1"
        value={form.years || ""}
        onChange={(e) => onChange("years", parseInt(e.target.value, 10) || 0)}
        onFocus={() => setFocusField("years")}
        onBlur={() => { setFocusField(null); markTouched("years"); }}
        style={inputStyle({ focused: focusField === "years" })}
        placeholder="1"
      />
      {touched.years && errors.years && <p style={styles.error}>{errors.years}</p>}

      <label style={styles.label}>Acerca de ti</label>
      <textarea
        value={form.about}
        onChange={(e) => onChange("about", e.target.value)}
        onFocus={() => setFocusField("about")}
        onBlur={() => { setFocusField(null); markTouched("about"); }}
        style={{ ...inputStyle({ focused: focusField === "about" }), resize: "vertical" }}
        rows={4}
        placeholder="Contanos brevemente…"
      />
      {touched.about && errors.about && <p style={styles.error}>{errors.about}</p>}
    </div>
  );
}

/* ---------- Paso 2: Tarifa + Horarios ---------- */
function Step2({ form, onChange, errors, touched, markTouched }) {
  const [hoverShift, setHoverShift] = useState(null);
  const [focusField, setFocusField] = useState(null);

  const toggleShift = (k) => {
    onChange("shifts", { ...form.shifts, [k]: !form.shifts[k] });
    markTouched("shifts");
  };

  return (
    <div>
      <h2 style={styles.title}>Tus tarifas y tus horarios</h2>

      <label style={styles.label}>Tarifa base (UYU/h)</label>
      <input
        value={form.rate}
        onChange={(e) => onChange("rate", e.target.value)}
        onFocus={() => setFocusField("rate")}
        onBlur={() => { setFocusField(null); markTouched("rate"); }}
        style={inputStyle({ focused: focusField === "rate" })}
        placeholder="Ej: 600"
        inputMode="numeric"
      />
      {touched.rate && errors.rate && <p style={styles.error}>{errors.rate}</p>}

      <label style={styles.label}>Horarios disponibles</label>
      <div style={styles.shiftGrid}>
        {[
          ["manana", "Mañana"],
          ["tarde", "Tarde"],
          ["noche", "Noche"],
          ["madrugada", "Madrugada"],
        ].map(([key, label]) => {
          const checked = form.shifts[key];
          const hovered = hoverShift === key;
          return (
            <label
              key={key}
              style={boxStyle({ hovered, checked })}
              onMouseEnter={() => setHoverShift(key)}
              onMouseLeave={() => setHoverShift(null)}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleShift(key)}
                onBlur={() => markTouched("shifts")}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>
      {touched.shifts && errors.shifts && <p style={styles.error}>{errors.shifts}</p>}
    </div>
  );
}

/* ---------- Paso 3: Cédula + Portfolio (opcional) ---------- */
function Step3({ form, onChange, errors, touched, markTouched }) {
  const onFile = (k, files) => { onChange(k, files?.[0] ?? null); markTouched(k); };
  const onPortfolio = (files) => onChange("portfolio", Array.from(files ?? []));

  return (
    <div>
      <h2 style={styles.title}>Información personal</h2>

      <div style={styles.uploadRow}>
        <div>
          <UploadBox label="Frente de cédula (Tomar imagen)" onChange={(f) => onFile("ciFront", f)} capture />
          {touched.ciFront && errors.ciFront && <p style={styles.error}>{errors.ciFront}</p>}
        </div>
        <div>
          <UploadBox label="Reverso de cédula (Tomar imagen)" onChange={(f) => onFile("ciBack", f)} capture />
          {touched.ciBack && errors.ciBack && <p style={styles.error}>{errors.ciBack}</p>}
        </div>
      </div>

      <label style={styles.label}>Fotos de trabajos (opcional)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => onPortfolio(e.target.files)}
        style={styles.inputFile}
      />
    </div>
  );
}

function UploadBox({ label, onChange, capture }) {
  return (
    <label style={styles.uploadBox}>
      <span style={{ marginBottom: 8, color: "#cfe8ff" }}>{label}</span>
      <input
        type="file"
        accept="image/*"
        capture={capture ? "environment" : undefined}
        onChange={(e) => onChange(e.target.files)}
        style={{ display: "none" }}
      />
      <div style={styles.uploadInner}>📷 Tomar imagen</div>
    </label>
  );
}

/* ---------- Estilos ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    background: "radial-gradient(1200px 600px at 70% -10%, #0d2336, #070b12)",
    overflow: "hidden",
  },
  bgWrapper: { position: "absolute", inset: 0, zIndex: 1 },
  bgImg: {
    position: "absolute",
    inset: 0,
    objectFit: "cover",
    objectPosition: "left center",
    filter: "brightness(0.9)",
  },
  cardPane: {
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 28,
  },
  card: {
    width: "min(560px, 92vw)",
    background: "rgba(10,16,26,0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 24,
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.30)",
  },
  logo: {
    textAlign: "center",
    fontSize: 28,
    color: "#4cc0ff",
    fontWeight: 800,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 90,
  },
  progressRow: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 },
  dot: { width: 34, height: 34, borderRadius: 999, border: "1px solid", display: "grid", placeItems: "center", fontSize: 14, color: "white" },
  title: { fontSize: 22, fontWeight: 800, margin: "6px 0 12px" },
  label: { display: "block", fontSize: 14, color: "#b9d9ff", margin: "12px 0 8px" },

  inputFile: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px dashed rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.05)",
    color: "#cfe8ff",
  },

  servicesGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 },
  shiftGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginTop: 6 },

  uploadRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  uploadBox: {
    display: "flex",
    flexDirection: "column",
    padding: 12,
    borderRadius: 12,
    border: "1px dashed rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer",
  },
  uploadInner: {
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    padding: "16px 12px",
    textAlign: "center",
  },

  error: { color: "#f87171", fontSize: 13, marginTop: 6 },

  footer: { display: "flex", gap: 12, justifyContent: "space-between", marginTop: 18 },
  btnPrimary: { padding: "12px 18px", background: "#2ea3ff", border: "none", color: "white", borderRadius: 12, fontWeight: 700, cursor: "pointer" },
  btnGhost: { padding: "12px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.22)", color: "white", borderRadius: 12, cursor: "pointer" },
};
