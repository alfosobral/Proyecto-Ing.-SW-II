import React from "react";
import { useState, useMemo , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import Card from "../components/Card";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import CheckboxField from "../components/CheckboxField";
import back from "../assets/RegisterBackground.png";
import back2 from "../assets/RegisterBackground2.png";
import back3 from "../assets/RegisterBackground3.png";
import back4 from "../assets/RegisterBackground4.png";
import back5 from "../assets/RegisterBackground5.png";
import back6 from "../assets/RegisterBackground6.png";
import back7 from "../assets/RegisterBackground7.png";
import back8 from "../assets/RegisterBackground8.png";

const initial = { email: "", password: "", remember: false };

const backgrounds = [back, back2, back3, back4, back5, back6, back7, back8];

export default function LogIn() {
  const [form, setForm] = React.useState(initial);
  const [serverErrors, setServerErrors] = useState({});
  const [touched, setTouched] = React.useState({});
  const [focused, setFocused] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => validate(form), [form]);

  const isValid = !Object.values(errors).some(Boolean) && form.email && form.password;

   function onChange(e) {
    const { name, type, value, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setServerErrors(se => (se[name] ? { ...se, [name]: undefined } : se));
  }

  const onBlur = e => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  };

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
    const API = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (!res.ok) {
        const text = await res.text(); // puede venir JSON o texto
        let data = null;
        try { data = JSON.parse(text); } catch { /* queda null */ }

        const mapped = {};

        if (data?.validationErrors && typeof data.validationErrors === "object") {
          Object.assign(mapped, data.validationErrors);
        } else if (Array.isArray(data?.errors)) {
          for (const e of data.errors) {
            if (e.field && e.message) mapped[e.field] = e.message;
          }
        } else if (data?.message) {
          if (typeof data?.message === "string" && /bad credentials/i.test(data.message)) {
            mapped.email = "Correo invalido"
          } else if (typeof data?.message === "string" && /redenciales ingresadas incorrectas/i.test(data.message)){
            mapped.password = "Contraseña incorrecta"; // por si querés mostrar un error general
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
      navigate("/main_page");
    } catch (err) {
      console.error("Error al registrar:", err);
    } finally {
      setLoading(false);
    }
  }


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
      <div className="bg-slideshow" aria-hidden>
        {backgrounds.map((src, i) => (
          <img key={i} src={src} alt="" className={`bg-slide ${i === idx ? "is-active" : ""}`} />
        ))}
        <div className="bg-vignette" />
      </div>
      <Card style={{ zIndex: 10 }}>
        <form onSubmit={onSubmit}>
          <img src={logo} alt="Logo Hurry Hand" width={200} style={{ display: "block", margin: "0 auto" }} />
          <h1 style={styles.title}>Iniciar sesión</h1>

          <InputField
            id="email"
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={() => setFocused("email")}
            placeholder="tu@email.com"
            error={errors.email || serverErrors.email}
            touched={touched.email || !!serverErrors.email}
          />


          <PasswordField
            id="password"
            label="Contraseña"
            name="password"
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

          <CheckboxField
            id="remember"
            label="Recordarme"
            checked={form.remember}
            onChange={onChange}
          />

		  <div style={{ width: "100%", textAlign: "center", margin: "20px 0 0 0", fontSize: 14, color: "#bababaff" }}>
				¿Aún no tienes una cuenta?{' '}
				<a href="/register" style={{ color: "#30a5e8", textDecoration: "underline", fontWeight: 600 }}>Regístrate aquí</a>
			</div>

      <button
        type="submit"
        disabled={!isValid || loading}
        style={buttonStyle(!isValid || loading)}
      >
        {loading ? "Enviando..." : "Iniciar sesión"}
      </button>
        </form>
      </Card>
    </div>
  );
}

function validate(f) {
  const errs = {};
  if (!isValidEmail(f.email)) errs.email = "Email inválido.";
  if (f.password.length < 8) errs.password = "Mínimo 8 caracteres.";
  return errs;
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function toBackendPayload(form) {
  return {
    email: form.email,
    password: form.password,
  };
}

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
};
