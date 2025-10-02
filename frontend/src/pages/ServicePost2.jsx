import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// === Fondos (mantenemos el slideshow estilo Register/ServicePost original) ===
import back1 from "../assets/RegisterBackground.png";
import back2 from "../assets/RegisterBackground2.png";
import back3 from "../assets/RegisterBackground3.png";
import back4 from "../assets/RegisterBackground4.png";
import back5 from "../assets/RegisterBackground5.png";
import back6 from "../assets/RegisterBackground6.png";

// === Componentes compartidos ===
import Card from "../components/Card";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import CheckBoxField from "../components/CheckboxField";
import DateField from "../components/DateField";
import TextAreaField from "../components/TextAreaField";

// MultiSelect con estética/animaciones alineadas
import MultiSelectField from "../components/MultiSelectField";

// ================= Constantes =================
const DURATION_OPTIONS = [
  { value: "", label: "Seleccioná duración" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 hora" },
  { value: "90", label: "1 hora y media" },
  { value: "120", label: "2 horas" },
  { value: "150", label: "2 horas y media" },
  { value: "180", label: "3 horas" },
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

const DAY_INDEX_TO_KEY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]; // Date.getDay()

const URU_DEPARTMENTS = [
  { value: "ARTIGAS", label: "Artigas" },
  { value: "CANELONES", label: "Canelones" },
  { value: "CERRO_LARGO", label: "Cerro Largo" },
  { value: "COLONIA", label: "Colonia" },
  { value: "DURAZNO", label: "Durazno" },
  { value: "FLORES", label: "Flores" },
  { value: "FLORIDA", label: "Florida" },
  { value: "LAVALLEJA", label: "Lavalleja" },
  { value: "MALDONADO", label: "Maldonado" },
  { value: "MONTEVIDEO", label: "Montevideo" },
  { value: "PAYSANDU", label: "Paysandú" },
  { value: "RIO_NEGRO", label: "Río Negro" },
  { value: "RIVERA", label: "Rivera" },
  { value: "ROCHA", label: "Rocha" },
  { value: "SALTO", label: "Salto" },
  { value: "SAN_JOSE", label: "San José" },
  { value: "SORIANO", label: "Soriano" },
  { value: "TACUAREMBO", label: "Tacuarembó" },
  { value: "TREINTA_Y_TRES", label: "Treinta y Tres" },
];

const initial = {
  // Paso 1: datos base
  title: "",
  description: "",
  xMinutes: 0, // number
  rate: "",
  validUntil: "", // yyyy-mm-dd

  // Paso 2: disponibilidad
  weeklySlots: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },

  // Paso 3: opcionales
  portfolio: [],
  addLocation: false,
  location: { department: "", city: "", street: "", doorNumber: "", postalCode: "", apartment: "" },
};

// =============== Componente principal ==================
export default function ServicePost() {
  const navigate = useNavigate();

  // Estado general (alineado a Register)
  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fondo slideshow (mantener estilo original)
  const backgrounds = [back1, back2, back3, back4, back5, back6];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    backgrounds.forEach((src) => { const i = new Image(); i.src = src; });
  }, []);
  useEffect(() => {
    if (backgrounds.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % backgrounds.length), 5000);
    return () => clearInterval(t);
  }, []);

  // ======== Paso/Slide (mantener 3 slides) =========
  const [step, setStep] = useState(0); // 0=datos base, 1=disponibilidad, 2=extras

  // ======== Validación general y por paso =========
  const rawErrors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(rawErrors).length === 0;

  const getFieldError = (name) => {
    const hasBeenInteracted = touched[name] || submitted;
    if (!hasBeenInteracted) return undefined;
    return serverErrors[name] || rawErrors[name];
  };

  const canGoNext = (s) => {
    if (s === 0) {
      // Reglas sólo de Paso 1
      const e = validateStep1(form);
      return Object.keys(e).length === 0;
    }
    if (s === 1) {
      // Reglas sólo de Paso 2 (al menos una franja)
      const e = validateStep2(form);
      return Object.keys(e).length === 0;
    }
    return true;
  };

  const next = () => {
    const localTouched = step === 0
      ? { title: true, description: true, xMinutes: true, rate: true, validUntil: true }
      : step === 1
      ? { weeklySlots: true }
      : {};
    setTouched((t) => ({ ...t, ...localTouched }));
    if (canGoNext(step)) {
      console.log('➡️ Avanzando del paso', step, 'al paso', step + 1);
      setStep((s) => Math.min(2, s + 1));
    }
  };
  
  const handleNextClick = (e) => {
    e.preventDefault(); // Prevenir cualquier envío del form
    e.stopPropagation(); // Evitar propagación del evento
    next();
  };
  
  const back = () => setStep((s) => Math.max(0, s - 1));

  // ======== Opciones dinámicas de horarios según duración ========
  const dayOptions = useMemo(() => buildDayOptions(Number(form.xMinutes || 0)), [form.xMinutes]);

  // ======== Handlers =========
  function onBlur(e) {
    const key = e.target.name || e.target.id;
    if (!key) return;
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function onChange(e) {
    const { id, name, type, value, checked, files } = e.target;
    const key = name || id;
    if (!key) return;

    if (key === "portfolio") {
      setForm((f) => ({ ...f, portfolio: Array.from(files ?? []) }));
    } else if (type === "checkbox") {
      setForm((f) => ({ ...f, [key]: checked }));
    } else {
      setForm((f) => ({ ...f, [key]: value }));
    }

    setServerErrors((se) => (se[key] ? { ...se, [key]: undefined } : se));
    if (!touched[key]) setTouched((t) => ({ ...t, [key]: true }));
  }

  // Cambio especial de duración → limpia slots porque cambian las franjas
  function onChangeDuration(e) {
    const v = Number(e.target.value || 0);
    setForm((f) => ({
      ...f,
      xMinutes: v,
      weeklySlots: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },
    }));
    setTouched((t) => ({ ...t, xMinutes: true }));
    setServerErrors((se) => (se.xMinutes ? { ...se, xMinutes: undefined } : se));
  }

  const setDaySlots = (dayKey, values /* string[] */) => {
    setForm((f) => ({ ...f, weeklySlots: { ...f.weeklySlots, [dayKey]: values.map(String) } }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    
    // VALIDACIÓN CRÍTICA: Solo permitir envío en el paso final
    if (step !== 2) {
      console.log('🚫 Intento de envío bloqueado. Paso actual:', step, 'Requerido: 2');
      return;
    }
    
    setSubmitted(true);

    if (!isValid) {
      // marca campos como tocados
      setTouched((t) => ({
        ...t,
        title: true, description: true, xMinutes: true, rate: true, validUntil: true,
        weeklySlots: true, department: true, city: true, street: true, doorNumber: true, postalCode: true,
      }));
      console.log('❌ Formulario inválido, no se puede enviar');
      return;
    }

    console.log('✅ Iniciando envío del servicio desde paso:', step);

    setLoading(true);
    setServerErrors({});

    try {
      const payload = toBackendPayload(form); // Sin URLs de fotos previas
      const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const endpoint = `${API}/api/service-post`;

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('❌ Token no encontrado en localStorage');
        alert('Por favor, inicia sesión nuevamente');
        navigate('/login');
        return;
      }

      console.log('✅ Token encontrado:', token.substring(0, 50) + '...');
      console.log('📦 Payload a enviar:', payload);

      // Crear FormData para multipart
      const formData = new FormData();
      formData.append('servicePost', new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      }));

      // Agregar fotos si existen
      if (form.portfolio && form.portfolio.length > 0) {
        console.log('📸 Agregando fotos al FormData:', form.portfolio.length, 'archivos');
        form.portfolio.forEach(file => {
          formData.append('photos', file);
        });
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`
          // NO incluir Content-Type para FormData - se establece automáticamente
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        let data = null; try { data = JSON.parse(text); } catch {}
        const mapped = mapBackendErrorsToFields(data);
        if (Object.keys(mapped).length) {
          setServerErrors(mapped);
          setTouched((t) => ({ ...t, ...Object.fromEntries(Object.keys(mapped).map((k) => [k, true])) }));
        }
        throw new Error(data?.message || text || `Error ${res.status}`);
      }

      const servicePostData = await res.json();
      console.log('✅ Service post creado exitosamente:', servicePostData);

      navigate("/home_page");
    } catch (err) {
      console.error("Error al publicar servicio:", err);
    } finally {
      setLoading(false);
    }
  }

  // =============== Render ===============
  return (
    <div style={styles.page}>
      {/* Slideshow */}
      <div className="bg-slideshow" aria-hidden>
        {[back, back2, back3, back4, back5, back6].map((src, i) => (
          <img key={i} src={src} alt="" className={`bg-slide ${i === idx ? "is-active" : ""}`} />
        ))}
        <div className="bg-vignette" />
      </div>

      <Card style={{ zIndex: 10, position: "relative", overflow: "visible" }}>
        <form onSubmit={onSubmit}>
          <h1 style={styles.title}>Publicar servicio</h1>

          {/* ===== Navegación de pasos ===== */}
          <div style={styles.stepsHeader}>
            {['Datos', 'Disponibilidad', 'Extras'].map((t, i) => (
              <div key={t} style={styles.stepDot(i === step)}>{t}</div>
            ))}
          </div>

          <div style={{ minHeight: 420, position: "relative" }}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step-0" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                  <InputField
                    id="title"
                    label="Título del servicio"
                    value={form.title}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="Ej: Instalación de luminarias"
                    error={getFieldError("title")}
                    touched={touched.title || submitted}
                  />

                  <TextAreaField
                    id="description"
                    label="Descripción"
                    value={form.description}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="Alcance, materiales incluidos, etc."
                    error={getFieldError("description")}
                    touched={touched.description || submitted}
                  />

                  <SelectField
                    id="xMinutes"
                    label="Tiempo estimado"
                    value={String(form.xMinutes || "")}
                    onChange={onChangeDuration}
                    onBlur={onBlur}
                    options={DURATION_OPTIONS}
                    error={getFieldError("xMinutes")}
                    touched={touched.xMinutes || submitted}
                  />

                  <InputField
                    id="rate"
                    label="Tarifa base (UYU)"
                    value={form.rate}
                    onChange={onChange}
                    onBlur={onBlur}
                    inputMode="numeric"
                    placeholder="Ej: 600"
                    error={getFieldError("rate")}
                    touched={touched.rate || submitted}
                  />

                  <DateField
                    id="validUntil"
                    label="Válido hasta"
                    value={form.validUntil}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={getFieldError("validUntil")}
                    touched={touched.validUntil || submitted}
                  />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step-1" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                  <label style={styles.label}>Disponibilidad por día</label>
                  <div style={styles.weekGrid}>
                    {DAYS.map(({ key, label }) => (
                      <div key={key} style={styles.dayCol}>
                        <MultiSelectField
                          id={`dd-${key}`}
                          label={label}
                          options={dayOptions}
                          values={(form.weeklySlots?.[key] || []).map(String)}
                          onChange={(vals) => setDaySlots(key, vals)}
                          placeholder={form.xMinutes ? "Elegir franjas" : "Primero elegí duración"}
                          error={undefined}
                          touched={touched.weeklySlots || submitted}
                        />
                      </div>
                    ))}
                  </div>
                  {getFieldError("weeklySlots") && (
                    <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{getFieldError("weeklySlots")}</p>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step-2" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                  <div style={styles.uploadBox}>
                    <span style={{ marginBottom: 8, color: "#cfe8ff" }}>Fotos de trabajos (opcional)</span>
                    <input type="file" id="portfolio" name="portfolio" multiple accept="image/*" onChange={onChange} />
                  </div>

                  <div style={{ marginTop: 14, marginBottom: 8, color: "#cfe8ff" }}>
                    La ubicación es <strong>opcional</strong>. Activá el switch si querés agregarla.
                  </div>

                  <CheckBoxField id="addLocation" label="Quiero agregar ubicación" checked={!!form.addLocation} onChange={onChange} />

                  {form.addLocation && (
                    <div style={{ marginTop: 10 }}>
                      <SelectField
                        id="department"
                        label="Departamento"
                        value={String(form.location.department || "")}
                        onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, department: e.target.value } }))}
                        onBlur={onBlur}
                        options={[{ value: "", label: "Seleccioná un departamento" }, ...URU_DEPARTMENTS]}
                        error={getFieldError("department")}
                        touched={touched.department || submitted}
                      />

                      <InputField
                        id="city"
                        label="Ciudad"
                        value={form.location.city}
                        onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, city: e.target.value } }))}
                        onBlur={onBlur}
                        error={getFieldError("city")}
                        touched={touched.city || submitted}
                      />

                      <InputField
                        id="street"
                        label="Calle"
                        value={form.location.street}
                        onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, street: e.target.value } }))}
                        onBlur={onBlur}
                        error={getFieldError("street")}
                        touched={touched.street || submitted}
                      />

                      <InputField
                        id="doorNumber"
                        label="Número de puerta"
                        value={form.location.doorNumber}
                        onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, doorNumber: e.target.value } }))}
                        onBlur={onBlur}
                        inputMode="numeric"
                        error={getFieldError("doorNumber")}
                        touched={touched.doorNumber || submitted}
                      />

                      <InputField
                        id="postalCode"
                        label="Código postal"
                        value={form.location.postalCode}
                        onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, postalCode: e.target.value } }))}
                        onBlur={onBlur}
                        inputMode="numeric"
                        error={getFieldError("postalCode")}
                        touched={touched.postalCode || submitted}
                      />

                      <InputField
                        id="apartment"
                        label="Número de apartamento (opcional)"
                        value={form.location.apartment}
                        onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, apartment: e.target.value } }))}
                        onBlur={onBlur}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== Botonera ===== */}
          <div style={styles.footerBtns}>
            {step > 0 && (
              <button type="button" onClick={back} style={secondaryBtn}>Atrás</button>
            )}
            {step < 2 ? (
              <button type="button" onClick={handleNextClick} style={primaryBtn(!canGoNext(step))} disabled={!canGoNext(step)}>
                Siguiente
              </button>
            ) : (
              <button type="submit" style={primaryBtn(!isValid || loading)} disabled={!isValid || loading}>
                {loading ? "Publicando..." : "Publicar servicio"}
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

// =================== Validaciones ===================
function validateStep1(f) {
  const errs = {};
  if (!f.title?.trim()) errs.title = "El título es obligatorio.";
  if (!f.description?.trim()) errs.description = "La descripción es obligatoria.";
  if (!Number(f.xMinutes)) errs.xMinutes = "Seleccioná una duración.";
  if (!String(f.rate).trim()) errs.rate = "La tarifa es obligatoria.";
  if (!f.validUntil) errs.validUntil = "Indicá hasta qué día es válida.";
  return errs;
}

function validateStep2(f) {
  const errs = {};
  const any = Object.values(f.weeklySlots || {}).some((arr) => (arr || []).length > 0);
  if (!any) errs.weeklySlots = "Elegí al menos una franja en algún día.";
  return errs;
}

function validate(f) {
  return { ...validateStep1(f), ...validateStep2(f), ...(f.addLocation ? validateLocation(f.location) : {}) };
}

function validateLocation(loc) {
  const errs = {};
  if (!loc?.department) errs.department = "Seleccioná un departamento.";
  if (!loc?.city?.trim()) errs.city = "Ingresá la ciudad.";
  if (!loc?.street?.trim()) errs.street = "Ingresá la calle.";
  if (!loc?.doorNumber) errs.doorNumber = "Ingresá el número de puerta.";
  if (!loc?.postalCode) errs.postalCode = "Ingresá el código postal.";
  return errs;
}

// ================ Opciones de horarios =================
function buildDayOptions(xMinutes) {
  if (!xMinutes || xMinutes <= 0) return [];
  // Ventana operativa 06:00 a 24:00
  const startMin = 6 * 60;
  const endOfDay = 24 * 60; // 24:00
  const opts = [];

  for (let start = startMin; start < endOfDay; start += 60) { // saltos de 1h para la grilla
    const end = start + xMinutes;
    if (end <= endOfDay) {
      const sH = Math.floor(start / 60);
      const sM = start % 60;
      const eH = Math.floor(end / 60);
      const eM = end % 60;
      opts.push({ value: String(sH), label: `${fmt(sH)}:${fmt(sM)} – ${fmt(eH)}:${fmt(eM)}` });
    }
  }
  return opts;
}

function fmt(n) { return String(n).padStart(2, "0"); }

// =================== Payload/Backend ===================
function mapBackendErrorsToFields(data) {
  const mapped = {};
  if (data?.validationErrors && typeof data.validationErrors === "object") {
    Object.assign(mapped, data.validationErrors);
  } else if (Array.isArray(data?.errors)) {
    for (const e of data.errors) if (e.field && e.message) mapped[e.field] = e.message;
  } else if (data?.message) {
    if (/t[ií]tulo|title/i.test(data.message)) mapped.title = data.message;
    else if (/descrip/i.test(data.message)) mapped.description = data.message;
    else if (/duraci[óo]n|minutes/i.test(data.message)) mapped.xMinutes = data.message;
    else if (/tarifa|precio|price/i.test(data.message)) mapped.rate = data.message;
    else if (/vigencia|válido/i.test(data.message)) mapped.validUntil = data.message;
    else mapped._general = data.message;
  }
  return mapped;
}

function toBackendPayload(form) {
  const normalizedSlots = Object.fromEntries(
    Object.entries(form.weeklySlots || {}).map(([key, hours]) => [
      key,
      (hours || [])
        .map((hour) => Number(hour))
        .filter((value) => Number.isInteger(value) && value >= 0 && value <= 23),
    ])
  );

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.rate || 0),
    duration: Number(form.xMinutes || 0),
    availableDates: buildAvailableDates(normalizedSlots, form.validUntil, Number(form.xMinutes || 0)),
    location: form.addLocation ? normalizeLocationForBackend(form.location) : null,
  };
}

function buildAvailableDates(weeklySlots, validUntil, xMinutes) {
  const result = [];
  const hasSlotsSelected = Object.values(weeklySlots).some((hours) => Array.isArray(hours) && hours.length > 0);
  if (!hasSlotsSelected) return result;
  if (!xMinutes) return result;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let endDate;
  if (validUntil) {
    const parsed = new Date(validUntil);
    if (!Number.isNaN(parsed.getTime())) { parsed.setHours(23, 59, 59, 999); endDate = parsed; }
  }
  if (!endDate) { const d = new Date(today); d.setDate(d.getDate() + 14); d.setHours(23,59,59,999); endDate = d; }

  for (let cursor = new Date(today); cursor <= endDate; cursor.setDate(cursor.getDate() + 1)) {
    const dayKey = DAY_INDEX_TO_KEY[cursor.getDay()];
    const hours = weeklySlots[dayKey] || [];
    for (const hour of hours) {
      const slotDate = new Date(cursor);
      slotDate.setHours(hour, 0, 0, 0);
      result.push(formatLocalDateTime(slotDate));
      if (result.length >= 200) return result;
    }
  }
  return result;
}

function formatLocalDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:00:00`;
}

function normalizeLocationForBackend(rawLocation) {
  if (!rawLocation) return null;
  const departamento = (rawLocation.department || "").trim();
  const location = {
    departamento: departamento || null,
    neighbourhood: blankToNull(rawLocation.city),
    street: blankToNull(rawLocation.street),
    streetNumber: numberOrNull(rawLocation.doorNumber),
    postalCode: numberOrNull(rawLocation.postalCode),
    aptoNumber: numberOrNull(rawLocation.apartment),
  };
  const hasAnyValue = Object.values(location).some((value) => value !== null);
  return hasAnyValue ? location : null;
}

function blankToNull(value) { if (typeof value !== "string") return null; const t = value.trim(); return t.length > 0 ? t : null; }
function numberOrNull(value) { if (value === undefined || value === null || value === "") return null; const n = Number(value); return Number.isFinite(n) ? n : null; }

// ================== Animaciones de slides ==================
const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { type: "tween", duration: 0.22 } },
  exit: { opacity: 0, x: -24, transition: { type: "tween", duration: 0.18 } },
};

// ================== Estilos ==================
const styles = {
  page: {
    minHeight: "85vh",
    width: "100vw",
    backgroundImage: `url(${back1})`,
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
  title: { margin: 0, marginTop: 20, marginBottom: 20, fontSize: 26, color: "#ffffffff", textAlign: "center" },
  label: { display: "block", fontSize: 14, color: "#b9d9ff", margin: "12px 0 8px" },
  weekGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 6 },
  dayCol: { border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: 10, background: "rgba(255,255,255,0.04)" },
  uploadBox: { display: "flex", flexDirection: "column", padding: 12, borderRadius: 12, border: "1px dashed rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.05)", marginTop: 12, marginBottom: 6 },
  stepsHeader: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "6px 0 18px" },
  stepDot: (active) => ({ textAlign: "center", padding: "6px 8px", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "white", background: active ? "#42b3fd" : "rgba(255,255,255,0.06)", border: active ? "4px solid #42b3fd" : "4px solid #cbd5e1" }),
  footerBtns: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 },
};

const primaryBtn = (disabled) => ({ width: 160, padding: "12px 0", borderRadius: 10, border: "none", background: disabled ? "#cbd5e1" : "#42b3fd", color: disabled ? "#64748b" : "#fff", fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer", transition: "background .2s" });
const secondaryBtn = { width: 120, padding: "12px 0", borderRadius: 10, border: "1px solid #cbd5e1", background: "transparent", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" };
