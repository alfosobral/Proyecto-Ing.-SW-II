// Adjust import paths to where your shared components live
import React, { useMemo, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Shared UI components
import Card from "../components/Card";            
import InputField from "../components/InputField";  
import CheckboxField from "../components/CheckboxField"; 
import DateField from "../components/DateField";   

// Assets
import back1 from "../assets/blacksmith.png";
import back2 from "../assets/carpenter.png";
import back3 from "../assets/painter.png";
import logoImg from "../assets/Logo.png";

// -----------------------------------------------------------
// Constantes
// -----------------------------------------------------------
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

const HOURS = Array.from({ length: (24 - 6) }, (_, i) => 6 + i); // 6..23

const URU_DEPARTMENTS = [
  "Artigas","Canelones","Cerro Largo","Colonia","Durazno","Flores","Florida","Lavalleja","Maldonado","Montevideo","Paysandú","Río Negro","Rivera","Rocha","Salto","San José","Soriano","Tacuarembó","Treinta y Tres"
].map(d => ({ value: String(d), label: d }));

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------
function formatHM(h, m = 0) {
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

function addMinutesToHour(hour, minutes) {
  const total = hour * 60 + (Number(minutes) || 0);
  const endH = Math.floor(total / 60);
  const endM = total % 60;
  return { endH, endM };
}

// -----------------------------------------------------------
// Validación
// -----------------------------------------------------------
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
    const anySlot = Object.values(form.weeklySlots || {}).some(arr => (arr || []).length > 0);
    if (!anySlot) errs.weeklySlots = "Elegí al menos un horario en algún día.";
  }
  if (step === 2) {
    if (form.addLocation) {
      if (!form.location?.department) errs.department = "Seleccioná un departamento.";
      if (!form.location?.city?.trim()) errs.city = "Ingresá la ciudad.";
      if (!form.location?.street?.trim()) errs.street = "Ingresá la calle.";
      if (!form.location?.doorNumber) errs.doorNumber = "Ingresá el número de puerta.";
      if (!form.location?.postalCode) errs.postalCode = "Ingresá el código postal.";
    }
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


function SectionTitle({ children }) {
  return <h2 style={styles.title}>{children}</h2>;
}

function TextAreaField({ id, label, value, onChange, onBlur, onFocus, placeholder }) {
  return (
    <div style={{ marginBottom: 14, width: "100%" }}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        rows={6}
        style={{ ...styles.inputBase, resize: "vertical", minHeight: 140 }}
      />
    </div>
  );
}

function UploadBox({ label, onChange }) {
  return (
    <label style={styles.uploadBox}>
      <span style={{ marginBottom: 8, color: "#cfe8ff" }}>{label}</span>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => onChange(e.target.files)}
        style={{ display: "none" }}
      />
      <div style={styles.uploadInner}>📷 Subir imágenes</div>
    </label>
  );
}

// Dropdown helpers 
function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) onOutside?.(); }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [ref, onOutside]);
}

function DropdownMulti({ id, label, options, values = [], onChange }) {
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
          <span style={{ opacity:.8, fontSize:12 }}>{selectedLabels.length ? `${selectedLabels.length} seleccionada(s)` : 'Elegir franjas'}</span>
        </div>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div style={{ ...styles.dropdownPanel, bottom: '100%', top: 'auto' }}>
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

function DropdownSingle({ id, label, options, value = "", onChange, placeholder = "Seleccionar" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const current = options.find(o => String(o.value) === String(value));
  const display = current?.label || placeholder;

  const pick = (val) => { onChange(String(val)); setOpen(false); };

  return (
    <div ref={ref} style={styles.dropdownWrap}>
      <button type="button" id={id} onClick={() => setOpen(o=>!o)} style={styles.dropdownBtn}>
        <div style={{ display:'flex', gap:8, alignItems:'baseline' }}>
          <span style={{ fontWeight:700 }}>{label}</span>
          <span style={{ opacity:.8 }}>{display}</span>
        </div>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
          <div style={{ ...styles.dropdownPanel, bottom: '100%', top: 'auto' }}>
          {options.map(o => {
            const checked = String(o.value) === String(value);
            return (
              <div key={o.value} style={styles.dropdownItem(checked)} onClick={() => pick(o.value)}>
                {o.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------
// Componente principal
// -----------------------------------------------------------
export default function service_post() {
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
    weeklySlots: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }, // horas de inicio seleccionadas por día (strings)

    // Step 3 (portfolio + ubicación opcional)
    portfolio: [],
    addLocation: false,
    location: { department: "", city: "", street: "", doorNumber: "", postalCode: "", apartment: "" },
  });

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const errors = useMemo(() => validate(form, step), [form, step]);

  const next = () => {
    setAttemptedNext(true);
    const hasErrors = Object.keys(validate(form, step)).length > 0;
    if (hasErrors) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 2));
    setTouched({});
    setAttemptedNext(false);
  };
  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    setTouched({});
    setAttemptedNext(false);
  };

  const stepMessages = attemptedNext ? collectStepErrors(errors, step) : [];
  const backgrounds = [back1, back2, back3];

  return (
    <div style={styles.page}>
      {/* Fondo */}
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
            style={{ ...styles.bgImg, transform: "scale(0.50)" }}
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
          >
            <Card style={styles.cardOverrides}>
              <div style={styles.logo}>
                <img src={logoImg} alt="Logo HurryHand" style={{ height: 80, display: "block", margin: "0 auto" }} />
              </div>

              <Progress current={step} total={3} />

              {step === 0 && (
                <StepPostBasics form={form} onChange={onChange} errors={errors} touched={touched} markTouched={markTouched} />
              )}
              {step === 1 && (
                <StepPricingAndWeekly form={form} onChange={onChange} errors={errors} touched={touched} markTouched={markTouched} />
              )}
              {step === 2 && (
                <StepPortfolioAndLocation form={form} onChange={onChange} errors={errors} touched={touched} markTouched={markTouched} />
              )}

              {/* Resumen de errores del paso, arriba de los botones */}
              {stepMessages.length > 0 && (
                <div style={styles.errorSummary}>
                  {stepMessages.map((m, i) => (
                    <div key={i} style={styles.errorLine}>• {m}</div>
                  ))}
                </div>
              )}

              <div style={styles.footer}>
                <button onClick={back} disabled={step === 0} style={styles.btnGhost}>
                  Atrás
                </button>
                <button
                  onClick={step === 2 ? () => alert("✅ Publicado (demo)") : next}
                  style={styles.btnPrimary}
                >
                  {step === 2 ? "Publicar servicio" : "Siguiente"}
                </button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// Steps
// -----------------------------------------------------------
function StepPostBasics({ form, onChange, errors, touched, markTouched }) {
  const durationLabel = DURATION_OPTIONS.find(o => String(o.value) === String(form.xMinutes))?.label || "";
  return (
    <div style={{ width: "100%" }}>
      <SectionTitle>Datos del servicio</SectionTitle>

      <InputField
        id="title"
        label="Título del servicio"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
        onBlur={() => markTouched("title")}
        placeholder="Ej: Instalación de luminarias en apartamentos"
        style={{ ...styles.inputBase, color:'#fff' }}
      />

      <TextAreaField
        id="description"
        label="Descripción del servicio"
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        onBlur={() => markTouched("description")}
        placeholder="Describí el alcance, materiales incluidos/excluidos, tiempos estimados, etc."
      />

      {/* Duración estimada (X) */}
      <DropdownSingle
        id="xMinutes"
        label="Tiempo estimado"
        options={DURATION_OPTIONS}
        value={String(form.xMinutes || "")}
        onChange={(val) => onChange("xMinutes", val)}
        placeholder="Seleccioná duración"
      />
      {durationLabel && <div style={styles.helperText}>Seleccionado: {durationLabel}</div>}
    </div>
  );
}

function StepPricingAndWeekly({ form, onChange, errors, touched, markTouched }) {
  const x = Number(form.xMinutes || 0);

  const dayOptions = () => HOURS.map((h) => {
    const { endH, endM } = addMinutesToHour(h, x);
    // Solo mostrar si el horario de fin no supera las 24:00
    if (endH < 24 || (endH === 24 && endM === 0)) {
      return { value: String(h), label: `${formatHM(h)} – ${formatHM(endH, endM)}` };
    }
    return null;
  }).filter(Boolean);

  const setDay = (key, values /* string[] */) => {
    onChange("weeklySlots", { ...form.weeklySlots, [key]: values.map(v=>String(v)).sort((a,b)=>Number(a)-Number(b)) });
    markTouched("weeklySlots");
  };

  return (
    <div style={{ width: "100%" }}>
      <SectionTitle>Tarifa y disponibilidad</SectionTitle>

      <InputField
        id="rate"
        label="Tarifa base (UYU/h)"
        value={form.rate}
        onChange={(e) => onChange("rate", e.target.value)}
        onBlur={() => markTouched("rate")}
        placeholder="Ej: 600"
        style={{ ...styles.inputBase, color:'#fff' }}
        inputMode="numeric"
      />

      <DateField
        id="validUntil"
        label="Válido hasta"
        value={form.validUntil}
        onChange={(e) => onChange("validUntil", e.target.value)}
        onBlur={() => markTouched("validUntil")}
        style={{ ...styles.inputBase, color:'#fff' }}
      />

      <label style={styles.label}>Disponibilidad por día (las franjas usan la duración elegida)</label>

      <div style={styles.weekGrid}>
        {DAYS.map(({ key, label }) => (
          <div key={key} style={styles.dayCol}>
            <DropdownMulti
              id={`dd-${key}`}
              label={label}
              options={dayOptions()}
              values={(form.weeklySlots?.[key] || []).map(String)}
              onChange={(vals) => setDay(key, vals)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPortfolioAndLocation({ form, onChange, errors, touched, markTouched }) {
  const onPortfolio = (files) => onChange("portfolio", Array.from(files ?? []));

  return (
    <div style={{ width: "100%" }}>
      <SectionTitle>Galería y ubicación (opcional)</SectionTitle>

      <UploadBox label="Fotos de trabajos (opcional)" onChange={onPortfolio} />

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
          <DropdownSingle
            id="department"
            label="Departamento"
            options={[{ value: "", label: "Seleccioná un departamento" }, ...URU_DEPARTMENTS]}
            value={String(form.location.department || "")}
            onChange={(val) => onChange("location", { ...form.location, department: val })}
            placeholder="Seleccioná un departamento"
          />

          <InputField
            id="city"
            label="Ciudad"
            value={form.location.city}
            onChange={(e) => onChange("location", { ...form.location, city: e.target.value })}
            onBlur={() => markTouched("city")}
            style={{ ...styles.inputBase, color:'#fff' }}
          />

          <InputField
            id="street"
            label="Calle"
            value={form.location.street}
            onChange={(e) => onChange("location", { ...form.location, street: e.target.value })}
            onBlur={() => markTouched("street")}
            style={{ ...styles.inputBase, color:'#fff' }}
          />

          <InputField
            id="doorNumber"
            label="Número de puerta"
            type="number"
            value={form.location.doorNumber}
            onChange={(e) => onChange("location", { ...form.location, doorNumber: e.target.value })}
            onBlur={() => markTouched("doorNumber")}
            style={{ ...styles.inputBase, color:'#fff' }}
          />

          <InputField
            id="postalCode"
            label="Código postal"
            type="number"
            value={form.location.postalCode}
            onChange={(e) => onChange("location", { ...form.location, postalCode: e.target.value })}
            onBlur={() => markTouched("postalCode")}
            style={{ ...styles.inputBase, color:'#fff' }}
          />

          <InputField
            id="apartment"
            label="Número de apartamento (opcional)"
            type="number"
            value={form.location.apartment}
            onChange={(e) => onChange("location", { ...form.location, apartment: e.target.value })}
            style={{ ...styles.inputBase, color:'#fff' }}
          />
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------
// Progress
// -----------------------------------------------------------
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

// -----------------------------------------------------------
// Estilos
// -----------------------------------------------------------
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
  cardOverrides: {
    width: "min(560px, 92vw)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    background: "rgba(10,16,26,0.7)",
    overflow: 'visible',
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

  inputFile: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px dashed rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.05)",
    color: "#cfe8ff",
  },

  footer: { display: "flex", gap: 12, justifyContent: "space-between", marginTop: 12 },
  btnPrimary: { padding: "12px 18px", background: "#2ea3ff", border: "none", color: "white", borderRadius: 12, fontWeight: 700, cursor: "pointer" },
  btnGhost: { padding: "12px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.22)", color: "white", borderRadius: 12, cursor: "pointer" },
};  