import React, { useMemo, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TextAreaField from "../components/TextAreaField";



// UI compartidos existentes en el proyecto
import Card from "../components/Card";
import InputField from "../components/InputField";
import CheckboxField from "../components/CheckboxField";
import DateField from "../components/DateField";
import SelectField from "../components/SelectField";

// TODO: promover a componentes compartidos
// - TextAreaField (textarea con etiqueta y estilos)
// - MultiSelectField (selector múltiple tipo dropdown)

// Activos visuales (alineados a Register.jsx)
import logo from "../assets/Logo.png";
import back from "../assets/RegisterBackground.png";
import back2 from "../assets/RegisterBackground2.png";
import back3 from "../assets/RegisterBackground3.png";
import back4 from "../assets/RegisterBackground4.png";
import back5 from "../assets/RegisterBackground5.png";
import back6 from "../assets/RegisterBackground6.png";

// ------------------------------------------------------------------
// Constantes y helpers
// ------------------------------------------------------------------
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const DURATION_OPTIONS = [
  { value: "", label: "Seleccioná duración" },
  { value: "30", label: "30 min" },
  { value: "60", label: "1 hora" },
  { value: "90", label: "1 hora y media" },
  { value: "120", label: "2 horas" },
  { value: "150", label: "2 horas y media" },
];

const DAYS = [
  { key: "mon", label: "Lunes" },
  { key: "tue", label: "Martes" },
  { key: "wed", label: "Miércoles" },
  { key: "thu", label: "Jueves" },
  { key: "fri", label: "Viernes" },
  { key: "sat", label: "Sábado" },
  { key: "sun", label: "Domingo" },
];

const HOURS = Array.from({ length: 24 - 6 }, (_, i) => 6 + i); // 6..23

const URU_DEPARTMENTS = [
  "Artigas","Canelones","Cerro Largo","Colonia","Durazno","Flores","Florida","Lavalleja","Maldonado","Montevideo","Paysandú","Río Negro","Rivera","Rocha","Salto","San José","Soriano","Tacuarembó","Treinta y Tres"
].map(d => ({ value: String(d), label: d }));

// eslint-disable-next-line no-unused-vars
function formatHM(h, m = 0) {
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}
// eslint-disable-next-line no-unused-vars
function addMinutesToHour(hour, minutes) {
  const total = hour * 60 + (Number(minutes) || 0);
  const endH = Math.floor(total / 60);
  const endM = total % 60;
  return { endH, endM };
}

// ------------------------------------------------------------------
// Validación y utilidades comunes alineadas a Register.jsx
// ------------------------------------------------------------------
function validate(form, step) {
  const errs = {};
  if (step === 0) {
    if (!form.title.trim()) errs.title = "El título es obligatorio.";
    if (!form.description.trim()) errs.description = "La descripción es obligatoria.";
    if (!form.xMinutes) errs.xMinutes = "Seleccioná un tiempo estimado.";
  }
  if (step === 1) {
    if (!String(form.rate).trim()) errs.rate = "La tarifa es obligatoria.";
    if (!form.validUntil) errs.validUntil = "Indicá hasta qué día es válida.";
    const any = Object.values(form.weeklySlots || {}).some(arr => (arr || []).length > 0);
    if (!any) errs.weeklySlots = "Elegí al menos un horario en algún día.";
  }
  if (step === 2 && form.addLocation) {
    if (!form.location?.department) errs.department = "Seleccioná un departamento.";
    if (!form.location?.city?.trim()) errs.city = "Ingresá la ciudad.";
    if (!form.location?.street?.trim()) errs.street = "Ingresá la calle.";
    if (!form.location?.doorNumber) errs.doorNumber = "Ingresá el número de puerta.";
    if (!form.location?.postalCode) errs.postalCode = "Ingresá el código postal.";
  }
  return errs;
}

function collectStepErrors(errors, step) {
  const msgs = [];
  if (step === 0) {
    if (errors.title) msgs.push(errors.title);
    if (errors.description) msgs.push(errors.description);
    if (errors.xMinutes) msgs.push(errors.xMinutes);
  }
  if (step === 1) {
    if (errors.rate) msgs.push(errors.rate);
    if (errors.validUntil) msgs.push(errors.validUntil);
    if (errors.weeklySlots) msgs.push(errors.weeklySlots);
  }
  if (step === 2) {
    [errors.department, errors.city, errors.street, errors.doorNumber, errors.postalCode]
      .filter(Boolean)
      .forEach((e) => msgs.push(e));
  }
  return msgs;
}

const stepContentVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 72 : -72,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? -72 : 72,
    opacity: 0,
    scale: 0.98,
  }),
};

const stepTransition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

// ------------------------------------------------------------------
// Componentes locales (promover a compartidos luego)
// ------------------------------------------------------------------
function SectionTitle({ children }) {
  return <h2 style={styles.title}>{children}</h2>;
}


function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) onOutside?.(); }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [ref, onOutside]);
}

function MultiSelectField({ id, label, options, values = [], onChange, placeholder = "Elegir" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const selectedLabels = options.filter(o => values.includes(String(o.value))).map(o => o.label);
  const toggle = (val) => {
    const s = new Set(values.map(String));
    if (s.has(String(val))) s.delete(String(val)); else s.add(String(val));
    onChange(Array.from(s));
  };

  return (
    <div ref={ref} style={styles.dropdownWrap}>
      <button type="button" id={id} onClick={() => setOpen(o=>!o)} style={styles.dropdownBtn}>
        <div style={{ display:'flex', gap:8, alignItems:'baseline' }}>
          <span style={{ fontWeight:700 }}>{label}</span>
          <span style={{ opacity:.8, fontSize:12 }}>{selectedLabels.length ? `${selectedLabels.length} seleccionada(s)` : placeholder}</span>
        </div>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div style={styles.dropdownPanel}>
          {options.map(o => {
            const checked = values.includes(String(o.value));
            return (
              <label key={o.value} style={styles.dropdownItem(checked)}>
                <input type="checkbox" checked={checked} onChange={() => toggle(o.value)} style={{ display:'none' }} />
                {o.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Componente principal
// ------------------------------------------------------------------
export default function ServicePost() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDirection] = useState(1);
  const [touched, setTouched] = useState({});
  const [attemptedNext, setAttemptedNext] = useState(false); // mostrar errores tras intentar avanzar

  const [form, setForm] = useState({
    // Step 1 (post de servicio)
    title: "",
    description: "",
    xMinutes: "", // duración seleccionada (X) en minutos (string)

    // Step 2 (tarifa + disponibilidad semanal)
    rate: "",
    validUntil: "", // yyyy-mm-dd
    weeklySlots: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }, // strings de horas

    // Step 3 (portfolio + ubicación opcional)
    portfolio: [],
    addLocation: false,
    location: { department: "", city: "", street: "", doorNumber: "", postalCode: "", apartment: "" },
  });

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const errors = useMemo(() => validate(form, step), [form, step]);
  const stepMessages = attemptedNext ? collectStepErrors(errors, step) : [];

  const renderStep = () => {
    if (step === 0) {
      return (
        <StepPostBasics
          form={form}
          onChange={onChange}
          errors={errors}
          touched={touched}
          markTouched={markTouched}
        />
      );
    }
    if (step === 1) {
      return (
        <StepPricingAndWeekly
          form={form}
          onChange={onChange}
          errors={errors}
          touched={touched}
          markTouched={markTouched}
        />
      );
    }
    return (
      <StepPortfolioAndLocation
        form={form}
        onChange={onChange}
        errors={errors}
        touched={touched}
        markTouched={markTouched}
      />
    );
  };

  // fondos como en Register.jsx
  const backgrounds = [back, back2, back3, back4, back5, back6];
  const [idx, setIdx] = useState(0);
  useEffect(() => { backgrounds.forEach(src => { const i = new Image(); i.src = src; }); }, []);
  useEffect(() => {
    if (backgrounds.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % backgrounds.length), 5000);
    return () => clearInterval(t);
  }, []);

  const next = () => {
    setAttemptedNext(true);
    const hasErrors = Object.keys(validate(form, step)).length > 0;
    if (hasErrors) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 2));
    setTouched({});
    setAttemptedNext(false);
  };
  
  const backStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    setTouched({});
    setAttemptedNext(false);
  };

  async function onSubmit(e) {
    e?.preventDefault?.();
    setAttemptedNext(true);
    const hasErrors = Object.keys(validate(form, 2)).length > 0; // validar todo al final
    if (hasErrors) return;

    // construir payload coherente con estilo del proyecto
    const payload = toBackendPayload(form);
    const API = import.meta.env.VITE_API_URL;
    try {
      const res = await fetch(`${API}/api/service`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      // éxito
      navigate("/services/mine");
    } catch (err) {
      console.error("Error al publicar servicio:", err);
      // TODO: mapear errores del backend a campos como en Register.jsx
    }
  }

  return (
    <div style={styles.page}>
      {/* Fondo slideshow */}
      <div className="bg-slideshow" aria-hidden>
        {backgrounds.map((src, i) => (
          <img key={i} src={src} alt="" className={`bg-slide ${i === idx ? "is-active" : ""}`} />
        ))}
        <div className="bg-vignette" />
      </div>

      {/* Lado derecho con Card (coherente con Register.jsx) */}
      <div style={styles.containerRight}>
        <Card style={{ zIndex: 10 }}>
          <form onSubmit={onSubmit}>
            <h1 style={styles.title}>{titleByStep(step)}</h1>

            <div style={styles.stepWrapper}>
              <AnimatePresence initial={false} mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={stepContentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={stepTransition}
                  style={styles.stepPanel}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {stepMessages.length > 0 && (
              <div style={styles.errorSummary}>
                {stepMessages.map((m, i) => (
                  <div key={i} style={styles.errorLine}>- {m}</div>
                ))}
              </div>
            )}

            <div style={styles.footer}>
              <button type="button" onClick={backStep} disabled={step === 0} style={btnGhostStyle}>
                Atrás
              </button>
              {step < 2 ? (
                <button type="button" onClick={next} style={buttonStyle(false)}>
                  Siguiente
                </button>
              ) : (
                <button type="submit" style={buttonStyle(false)}>
                  Publicar servicio
                </button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Steps
// ------------------------------------------------------------------
function StepPostBasics({ form, onChange }) {
  const durationLabel = DURATION_OPTIONS.find(o => String(o.value) === String(form.xMinutes))?.label || "";
  return (
    <div style={{ width: "100%" }}>
      <SectionTitle>Datos del servicio</SectionTitle>

      <InputField
        id="title"
        label="Título del servicio"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
        placeholder="Ej: Instalación de luminarias en apartamentos"
      />

      <TextAreaField
        id="description"
        label="Descripción del servicio"
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Describí el alcance, materiales incluidos/excluidos, tiempos estimados, etc."
      />

      <SelectField
        id="xMinutes"
        label="Tiempo estimado"
        value={String(form.xMinutes || "")}
        onChange={(e) => onChange("xMinutes", e.target.value)}
        options={DURATION_OPTIONS}
      />
      {durationLabel && <div style={styles.helperText}>Seleccionado: {durationLabel}</div>}
    </div>
  );
}

function StepPricingAndWeekly({ form, onChange }) {
  const x = Number(form.xMinutes || 0);
  const dayOptions = HOURS.map((h) => {
    const { endH, endM } = addMinutesToHour(h, x);
    if (endH < 24 || (endH === 24 && endM === 0)) {
      return { value: String(h), label: `${formatHM(h)} – ${formatHM(endH, endM)}` };
    }
    return null;
  }).filter(Boolean);

  const setDay = (key, values /* string[] */) => {
    onChange("weeklySlots", { ...form.weeklySlots, [key]: values.map(v=>String(v)).sort((a,b)=>Number(a)-Number(b)) });
  };

  return (
    <div style={{ width: "100%" }}>
      <SectionTitle>Tarifa y disponibilidad</SectionTitle>

      <InputField
        id="rate"
        label="Tarifa base (UYU/h)"
        value={form.rate}
        onChange={(e) => onChange("rate", e.target.value)}
        placeholder="Ej: 600"
        inputMode="numeric"
      />

      <DateField
        id="validUntil"
        label="Válido hasta"
        value={form.validUntil}
        onChange={(e) => onChange("validUntil", e.target.value)}
      />

      <label style={styles.label}>Disponibilidad por día (las franjas usan la duración elegida)</label>

      <div style={styles.weekGrid}>
        {DAYS.map(({ key, label }) => (
          <div key={key} style={styles.dayCol}>
            <MultiSelectField
              id={`dd-${key}`}
              label={label}
              options={dayOptions}
              values={(form.weeklySlots?.[key] || []).map(String)}
              onChange={(vals) => setDay(key, vals)}
              placeholder="Elegir franjas"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPortfolioAndLocation({ form, onChange }) {
  const onPortfolio = (files) => onChange("portfolio", Array.from(files ?? []));

  return (
    <div style={{ width: "100%" }}>
      <SectionTitle>Galería y ubicación (opcional)</SectionTitle>

      {/* Subida de imágenes: simple, coherente con el resto */}
      <div style={styles.uploadBox}>
        <span style={{ marginBottom: 8, color: "#cfe8ff" }}>Fotos de trabajos (opcional)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onPortfolio(e.target.files)}
          style={{ display: "block" }}
        />
      </div>

      <div style={{ marginTop: 14, marginBottom: 8, color: "#cfe8ff" }}>
        La ubicación es <strong>opcional</strong>. Si querés agregarla, activá el siguiente switch.
      </div>

      <CheckboxField
        id="addLocation"
        label="Quiero agregar ubicación"
        checked={!!form.addLocation}
        onChange={() => onChange("addLocation", !form.addLocation)}
      />

      {form.addLocation && (
        <div style={{ marginTop: 10 }}>
          <SelectField
            id="department"
            label="Departamento"
            value={String(form.location.department || "")}
            onChange={(e) => onChange("location", { ...form.location, department: e.target.value })}
            options={[{ value: "", label: "Seleccioná un departamento" }, ...URU_DEPARTMENTS]}
          />

          <InputField
            id="city"
            label="Ciudad"
            value={form.location.city}
            onChange={(e) => onChange("location", { ...form.location, city: e.target.value })}
          />

          <InputField
            id="street"
            label="Calle"
            value={form.location.street}
            onChange={(e) => onChange("location", { ...form.location, street: e.target.value })}
          />

          <InputField
            id="doorNumber"
            label="Número de puerta"
            type="number"
            value={form.location.doorNumber}
            onChange={(e) => onChange("location", { ...form.location, doorNumber: e.target.value })}
          />

          <InputField
            id="postalCode"
            label="Código postal"
            type="number"
            value={form.location.postalCode}
            onChange={(e) => onChange("location", { ...form.location, postalCode: e.target.value })}
          />

          <InputField
            id="apartment"
            label="Número de apartamento (opcional)"
            type="number"
            value={form.location.apartment}
            onChange={(e) => onChange("location", { ...form.location, apartment: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Payload (alineado a convención del backend del proyecto)
// ------------------------------------------------------------------
function toBackendPayload(form) {
  const normalizeWeekly = Object.fromEntries(
    Object.entries(form.weeklySlots || {}).map(([k, arr]) => [k, (arr || []).map(Number)])
  );
  return {
    title: form.title,
    description: form.description,
    estimated_minutes: Number(form.xMinutes || 0),
    rate_per_hour_uyu: Number(form.rate || 0),
    valid_until: form.validUntil || null, // yyyy-mm-dd
    weekly_slots: normalizeWeekly,       // { mon: [6, 12, ...], ... }
    location: form.addLocation ? {
      department: form.location.department,
      city: form.location.city,
      street: form.location.street,
      door_number: form.location.doorNumber,
      postal_code: form.location.postalCode,
      apartment: form.location.apartment || null,
    } : null,
  };
}

// ------------------------------------------------------------------
// Estilos (alineados a Register.jsx)
// ------------------------------------------------------------------
const styles = {
  page: {
    minHeight: "85vh",
    width: "100vw",
    backgroundImage: `url(${back})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: "40px 60px 40px 0",
    backgroundAttachment: "fixed",
    position: "relative",
    overflow: "hidden",
  },
  containerRight: {
    position: "relative",
    zIndex: 2,
    minHeight: "85vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  stepWrapper: {
    position: "relative",
    display: "grid",
    width: "100%",
    overflow: "hidden",
    minHeight: 420,
    margin: "16px 0 24px",
    padding: "6px 2px",
    boxSizing: "border-box",
  },
  stepPanel: {
    gridArea: "1 / 1",
    width: "100%",
    padding: "0 6px",
    boxSizing: "border-box",
    overflow: "visible",
  },
  title: { margin: 0, marginTop: 20, marginBottom: 20, fontSize: 26, color: "#ffffffff", textAlign: "center" },
  label: { display: "block", fontSize: 14, color: "#b9d9ff", margin: "12px 0 8px" },

  inputBase: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
  },
  helperText: { marginTop: 6, fontSize: 12, color: '#d0eaff' },

  weekGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 6,
  },
  dayCol: {
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 12,
    padding: 10,
    background: "rgba(255,255,255,0.04)",
  },

  dropdownWrap: { position: 'relative' },
  dropdownBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.06)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.24)',
    borderRadius: 10,
    padding: '10px 12px',
    cursor: 'pointer',
  },
  dropdownPanel: {
    position: 'absolute',
    zIndex: 40,
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    maxHeight: 260,
    overflowY: 'auto',
    background: 'rgba(10,16,26,0.98)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
    padding: 8,
  },
  dropdownItem: (checked) => ({
    display: 'block',
    padding: '8px 10px',
    borderRadius: 10,
    border: checked ? '1px solid #2ea3ff' : '1px solid rgba(255,255,255,0.18)',
    background: checked ? 'rgba(46,163,255,0.15)' : 'rgba(255,255,255,0.03)',
    color: 'white',
    cursor: 'pointer',
    userSelect: 'none',
    marginBottom: 6,
  }),

  uploadBox: {
    display: "flex",
    flexDirection: "column",
    padding: 12,
    borderRadius: 12,
    border: "1px dashed rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.05)",
  },

  errorSummary: {
    marginTop: 10,
    marginBottom: 4,
    background: "rgba(255, 71, 87, 0.10)",
    border: "1px solid rgba(248, 113, 113, 0.6)",
    color: "#ffd6d6",
    borderRadius: 10,
    padding: "10px 12px",
  },
  errorLine: { fontSize: 13, lineHeight: 1.25 },

  footer: { display: "flex", gap: 12, justifyContent: "space-between", marginTop: 12 },
};

const btnGhostStyle = {
  padding: "12px 18px",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.22)",
  color: "white",
  borderRadius: 12,
  cursor: "pointer",
};

const buttonStyle = (disabled) => ({
  width: undefined,
  marginTop: 0,
  padding: "12px 18px",
  borderRadius: 10,
  border: "none",
  background: disabled ? "#cbd5e1" : "#42b3fd",
  color: disabled ? "#64748b" : "#fff",
  fontWeight: 700,
  fontSize: 16,
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "background .2s",
});

function titleByStep(step) {
  if (step === 0) return "Publicar servicio";
  if (step === 1) return "Publicar servicio";
  return "Publicar servicio";
}
