import { useState, useMemo , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from "../assets/Logo.png";
import back from "../assets/RegisterBackground.png";
import back2 from "../assets/RegisterBackground2.png";
import back3 from "../assets/RegisterBackground3.png";
import back4 from "../assets/RegisterBackground4.png";
import back5 from "../assets/RegisterBackground5.png";
import back6 from "../assets/RegisterBackground6.png";
import back7 from "../assets/RegisterBackground7.png";
import back8 from "../assets/RegisterBackground8.png";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import SelectField from "../components/SelectField";
import CheckboxField from "../components/CheckboxField";
import Card from "../components/Card";
import DateField from "../components/DateField";
import SummbitButton from "../components/SummbitButton";


const initial = { name: "", surname: "",documentType:"Cedula Uruguaya", document:"", birthDate: null, email: "", password: "", confirm: "", phoneNumber: "", accept: false };

export default function Register({ width = 420 }) {
  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [serverErrors, setServerErrors] = useState({});

  const errors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(errors).length === 0 && form.accept;

  function maxAdultDate() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  t.setFullYear(t.getFullYear() - 18);
  return t;
}

  function onChange(e) {
    const { name, type, value, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setServerErrors(se => (se[name] ? { ...se, [name]: undefined } : se));
  }

  function onBlur(e) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }

 {/* async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) alert("Por favor, corrige los errores del formulario.");
    const payload = toBackendPayload(form);
    const body = JSON.stringify(payload);
    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
    alert(body); // solo para ver el payload
    try {
    const res = await fetch(`${API}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text(); // <-- lee texto aunque no sea JSON
      console.error("Respuesta 400:", text);
      throw new Error(text || `Error ${res.status}`);
    }
  } catch (err) {
    console.error(" Error al registrar:", err);
  }
}
*/}

async function onSubmit(e) {
  e.preventDefault();
  if (!isValid) {
    setTouched(t => ({
      ...t,
      name:true, surname:true, document:true, phoneNumber:true,
      email:true, password:true, confirm:true, birthDate:true
    }));
    return;
  }

  setLoading(true);
  const payload = toBackendPayload(form);
  const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

  try {
    const res = await fetch(`${API}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text(); // puede venir JSON o texto
      let data = null;
      try { data = JSON.parse(text); } catch { /* queda null */ }

      // 1) Caso esperado en tu back: { validationErrors: { campo: "mensaje", ... }, message: "..."}
      // 2) Otros formatos comunes: { errors: [{field:"email", message:"..."}], message:"..."}
      const mapped = {};

      if (data?.validationErrors && typeof data.validationErrors === "object") {
        Object.assign(mapped, data.validationErrors);
      } else if (Array.isArray(data?.errors)) {
        for (const e of data.errors) {
          if (e.field && e.message) mapped[e.field] = e.message;
        }
      } else if (data?.message) {
        // heurística: si el mensaje menciona email duplicado, lo mapeamos a email
        if (/mail|correo/i.test(data.message) && /existe|registrad/i.test(data.message)) {
          mapped.email = data.message;
        } else {
          mapped._general = data.message; // por si querés mostrar un error general
        }
      } else if (text) {
        // si vino texto plano
        if (/mail|correo/i.test(text) && /existe|registrad/i.test(text)) {
          mapped.email = text;
        } else {
          mapped._general = text;
        }
      }

      // marcar como touched los campos que tengan error del server
      if (Object.keys(mapped).length) {
        setServerErrors(mapped);
        setTouched(t => {
          const next = { ...t };
          for (const k of Object.keys(mapped)) next[k] = true;
          return next;
        });
      }

      throw new Error(data?.message || text || `Error ${res.status}`);
    }

    const data = await res.json();
    console.log("Signup OK:", data);
    alert(`✅ Registro creado para ${data.email ?? payload.email}`);
    navigate("/login");
  } catch (err) {
    console.error("Error al registrar:", err);
  } finally {
    setLoading(false);
  }
}

  const strength = passwordStrength(form.password);

  const backgrounds = [back, back2, back3, back4, back5, back6, back7, back8];
  const [idx, setIdx] = useState(0);

   useEffect(() => {
    backgrounds.forEach(src => { const i = new Image(); i.src = src; });
  }, [backgrounds]);

  useEffect(() => {
    if (backgrounds.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % backgrounds.length), 5000);
    return () => clearInterval(t);
  }, [backgrounds.length]);

  return (
    <div style={styles.page}>
      {/* Slideshow de fondo (las clases están en index.css) */}
      <div className="bg-slideshow" aria-hidden>
        {backgrounds.map((src, i) => (
          <img key={i} src={src} alt="" className={`bg-slide ${i === idx ? "is-active" : ""}`} />
        ))}
        <div className="bg-vignette" />
      </div>
      <Card style={{ zIndex: 10 }}>
      <form onSubmit={onSubmit}>
      <img src={logo} alt="Logo Hurry Hand" width={200} style={{ display: "block", margin: "0 auto"}} />
      <h1 style={styles.title}>¡Bienvenido a Hurry Hand!</h1>

      {/* Nombre */}
      <InputField
        id="name"
        label="Nombre"
        value={form.name}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={() => setFocused("name")}
        placeholder="Tu nombre"
        error={errors.name || serverErrors.name}
        touched={touched.name || !!serverErrors.name}
      />

      {/* Apellido */}
      <InputField
        id="surname" 
        label="Apellido"
        name="surname" 
        value={form.surname} 
        onChange={onChange} onBlur={onBlur}
        onFocus={() => setFocused("surname")} onBlurCapture={() => setFocused(null)}
        placeholder="Tu apellido"
        error={errors.surname || serverErrors.surname}
        touched={touched.surname || !!serverErrors.surname}
      />

      {/* Tipo de documento */}
      <SelectField
        id="documentType"
        label="Tipo de documento"
        value={form.documentType}
        onChange={onChange}
        onFocus={() => setFocused("documentType")}
        onBlur={() => setFocused(null)}
        options={[
          { value: "Cedula Uruguaya", label: "Cédula Uruguaya" },
          { value: "Otro", label: "Otro" }
        ]}
        error={errors.documentType || serverErrors.documentType}
        touched={touched.documentType || !!serverErrors.documentType}
      />

      {/* Documento */}
      <InputField
        id="document" 
        label="Documento"
        name="document" 
        value={form.document}
        onChange={e => {
          let value = e.target.value;
          if (form.documentType === "Cedula Uruguaya") {
            value = value.replace(/[^0-9]/g, "").slice(0, 8);
          } else {
            value = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 16); // puedes ajustar el largo máximo
          }
          setForm(f => ({ ...f, document: value }));
        }}
        onBlur={onBlur}
        onFocus={() => setFocused("document")} onBlurCapture={() => setFocused(null)}
        placeholder="Documento"
        error={errors.document || serverErrors.document}
        touched={touched.document || !!serverErrors.document}
      />

      {/* Nacimiento */}
      <DateField
        id="birthDate"
        label="Fecha de nacimiento"
        value={form.birthDate ? form.birthDate.toISOString().slice(0, 10) : ""}
        onChange={e => setForm(f => ({ ...f, birthDate: e.target.value ? new Date(e.target.value) : null }))}
        onBlur={onBlur}
        onFocus={() => setFocused("birthDate")}
        error={errors.birthDate || serverErrors.birthDate}
        touched={touched.birthDate || !!serverErrors.birthDate}
      />

      {/* Teléfono */}
      <InputField
        id="phoneNumber" 
        label="Teléfono"
        name="phoneNumber" 
        value={form.phoneNumber}
        onChange={e => {
          const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
          setForm(f => ({ ...f, phoneNumber: value }));
        }}
        onBlur={onBlur}
        onFocus={() => setFocused("phoneNumber")} onBlurCapture={() => setFocused(null)}
        placeholder="Teléfono"
        error={errors.phoneNumber || serverErrors.phoneNumber}
        touched={touched.phoneNumber || !!serverErrors.phoneNumber}
      />

      {/* Email */}
      <InputField
        id="email" 
        label="Email"
        name="email" 
        value={form.email} 
        onChange={onChange} onBlur={onBlur}
        onFocus={() => setFocused("email")} onBlurCapture={() => setFocused(null)}
        placeholder="tu@email.com"
        error={errors.email || serverErrors.email}
        touched={touched.email || !!serverErrors.email}
      />

      {/* Password */}
      <PasswordField
        id="password"
        label="Contraseña"
        value={form.password}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={() => setFocused("password")}
        placeholder="••••••••"
        show={showPassword}
        onToggle={() => setShowPassword(s => !s)}
        error={errors.password || serverErrors.password}
        touched={touched.password || !!serverErrors.password}
      />
      <div>
        <div style={styles.meterWrap} aria-hidden>
          <div style={{ ...styles.meterBar, width: `${strength.score * 25}%` }} />
        </div>
        <small style={styles.meterText}>{strength.label}</small>
      </div>

      {/* Confirm */}
      <PasswordField
        id="confirm" 
        label="Confirmar contraseña"
        name="confirm" 
        value={form.confirm} 
        onChange={onChange} 
        onBlur={onBlur}
        onFocus={() => setFocused("confirm")} 
        placeholder="Repite la contraseña"
        show={showConfirm}
        onToggle={() => setShowConfirm(s => !s)}
        error={errors.confirm || serverErrors.confirm}
        touched={touched.confirm || !!serverErrors.confirm}
      />

      {/* Términos */}
      <CheckboxField
        id="accept"
        label="Acepto los términos y condiciones"
        checked={form.accept}
        onChange={onChange}
        error={!form.accept ? "Debes aceptar para continuar" : ""}
      />

      <div style={{ margin: "18px 0 8px 0", textAlign: "center" }}>
        <span style={{ color: "#bababaff", fontSize: 15 }}>¿Ya tienes cuenta? </span>
        <a
          href="#"
          style={{ color: "#30a5e8", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}
          onClick={e => { e.preventDefault(); navigate("/login"); }}
        >Iniciar sesión</a>
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        style={buttonStyle(!isValid || loading)}
      >
        {loading ? "Enviando..." : "Crear cuenta"}
      </button>
    </form>
    </Card>
    </div>
  );
}

function validate(f) {
  const errs = {};
  if (!f.name.trim()) errs.name = "El nombre es obligatorio.";
  if (!f.surname.trim()) errs.surname = "El apellido es obligatorio.";
  if (!isValidDocument(f.document, f.documentType)) {
    errs.document = f.documentType === "Cedula Uruguaya"
      ? "El documento debe tener 8 dígitos numéricos."
      : "El documento es obligatorio (alfanumérico, mínimo 4 caracteres).";
  }
  if (!isValidPhone(f.phoneNumber)) errs.phoneNumber = "Teléfono inválido (9 dígitos).";
  if (!isValidEmail(f.email)) errs.email = "Email inválido.";
  if (f.password.length < 8) errs.password = "Mínimo 8 caracteres.";
  if (!/[A-Z]/.test(f.password)) errs.password ??= "Incluye al menos una mayúscula.";
  if (!/[0-9]/.test(f.password)) errs.password ??= "Incluye al menos un número.";
  if (!/[^A-Za-z0-9]/.test(f.password)) errs.password ??= "Incluye al menos un símbolo.";
  if (f.confirm !== f.password) errs.confirm = "Las contraseñas no coinciden.";
  if (!f.birthDate) {
    errs.birthDate = "La fecha de nacimiento es obligatoria.";
  } else if (isValidAge(f.birthDate) < 18) {
    errs.birthDate = "Debes ser mayor de 18 años.";
  }
  return errs;
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidDocument(s, type) {
  if (type === "Cedula Uruguaya") {
    return /^[0-9]{8}$/.test(s);
  } else {
    return /^[A-Za-z0-9]{4,}$/.test(s); // mínimo 4 caracteres alfanuméricos
  }
}

function isValidPhone(s) {
  return /^[0-9]{9}$/.test(s);
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

function isValidAge(birthDate) {
  if (!birthDate) return false;
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
}

function toBackendPayload(form) {
  return {
    email: form.email,
    password: form.password,
    name: form.name,
    surname: form.surname,
    phoneNumber: form.phoneNumber,
    personalId: form.document,
    personalIdType: form.documentType === "Cedula Uruguaya" ? "DNI_URUGUAYO" : "OTRO",
    birthdate: form.birthDate
      ? form.birthDate.toISOString().slice(0, 10)
      : null
  };
}

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
  backgroundAttachment: "fixed"
  },
  title: { margin: 0, marginTop: 20, marginBottom: 20, fontSize: 28, color: "#ffffffff", textAlign: "center"},
  meterWrap: { height: 6, background: "#e2e8f0", borderRadius: 999, marginTop: 6 },
  meterBar: { height: "100%", background: "#3b82f6", borderRadius: 999, transition: "width .25s" },
  meterText: { color: "#677384ff", fontSize: 12, display: "block", marginTop: 6 },
};

const buttonStyle = disabled => ({
    width: "100%",
    marginTop: 18,
    padding: "12px 0",
    borderRadius: 10,
    border: "none",
    background: disabled ? "#cbd5e1" : "#2563eb",
    color: disabled ? "#64748b" : "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background .2s",
  });