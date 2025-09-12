import React from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import loginIm from "../assets/LogIn.png";
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
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [focused, setFocused] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const navigate = useNavigate();

  const isValid = !Object.values(errors).some(Boolean) && form.email && form.password;

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onBlur = e => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  };

  const togglePassword = () => setShowPassword(v => !v);

  React.useEffect(() => {
    const errs = {};
    if (!form.email) errs.email = "El email es obligatorio.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) errs.email = "Email inválido.";
    if (!form.password) errs.password = "La contraseña es obligatoria.";
    setErrors(errs);
  }, [form]);

  const onSubmit = e => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (isValid) {
      // Aquí va la lógica de login
      alert("¡Login exitoso!");
      navigate("/main_page");
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => setIdx(i => (i + 1) % backgrounds.length), 5000);
    return () => clearInterval(interval);
  }, []);

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
            error={errors.email}
            touched={touched.email}
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
            error={errors.password}
            touched={touched.password}
            showPassword={showPassword}
            togglePassword={togglePassword}
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

          <button type="submit" disabled={!isValid} style={buttonStyle(!isValid)}>
            Iniciar sesión
          </button>
        </form>
      </Card>
    </div>
  );
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
