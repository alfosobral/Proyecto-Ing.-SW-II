import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import loginIm from "../assets/LogIn.png";
import logo from "../assets/Logo.png";

export default function LogIn() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const [touched, setTouched] = useState({});
	const [focused, setFocused] = useState(null);

	function inputStyle(isError, isFocused) {
		return {
			width: "450px", 
			maxWidth: "100%",
			padding: "10px 12px",
			borderRadius: 10,
			border: `2px solid ${isError ? "#ef4444" : isFocused ? "#2563eb" : "#cbd5e1"}`,
			outline: "none",
			fontSize: 14,
			transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
			transform: isFocused ? "scale(1.02)" : "scale(1)",
			boxShadow: isFocused ? "0 0 0 5px rgba(37,99,235,.15)" : "none",
			background: "white",
		};
	}

	function onChange(e) {
		const { name, value } = e.target;
		setForm(f => ({ ...f, [name]: value }));
	}

	function onBlur(e) {
	    setTouched(t => ({ ...t, [e.target.name]: true }));
  	}

	function onSubmit(e) {
		e.preventDefault();
		if (!form.email || !form.password) {
			setError("Completa ambos campos");
			return;
		}
		setError("");
		// Aca va la logica de autenticacion
	    alert("Inicio de sesión enviado (ver consola)");
	    console.log("LogIn:", form);
	    navigate("/main_page");
	}

		return (
			<div style={styles.page}>
				<form onSubmit={onSubmit} style={styles.card}>
					<img src={logo} alt="Logo Hurry Hand" width={120} style={{ marginBottom: 10 }} />
					<h1 style={styles.title}>Iniciar sesión</h1>
					<div style={styles.field}>
						<label style={styles.label} htmlFor="email">Email</label>
						<input
							id="email"
							name="email"
							value={form.email}
							onChange={onChange}
							onBlur={onBlur}
							onFocus={() => setFocused("email")}
							onBlurCapture={() => setFocused(null)}
							style={inputStyle(touched.email && !form.email, focused === "email")}
							placeholder="tu@email.com"
						/>
						{touched.email && !form.email && <p style={styles.error}>El email es obligatorio</p>}
					</div>
					<div style={styles.field}>
						<label style={styles.label} htmlFor="password">Contraseña</label>
						<div style={{ position: "relative", display: "flex", alignItems: "center" }}>
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								value={form.password}
								onChange={onChange}
								onBlur={onBlur}
								onFocus={() => setFocused("password")}
								onBlurCapture={() => setFocused(null)}
								style={{ ...inputStyle(touched.password && !form.password, focused === "password"), paddingRight: 36 }}
								placeholder="••••••••"
							/>
							<span
								onClick={() => setShowPassword(s => !s)}
								style={{ position: "absolute", right: 10, top: 0, bottom: 0, display: "flex", alignItems: "center", cursor: "pointer", color: "#bababaff", fontSize: 20 }}
							>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</span>
						</div>
						{touched.password && !form.password && <p style={styles.error}>La contraseña es obligatoria</p>}
					</div>
							{error && <p style={styles.error}>{error}</p>}
							<div style={{ width: "100%", textAlign: "center", margin: "20px 0 0 0", fontSize: 14, color: "#bababaff" }}>
								¿Aún no tienes una cuenta?{' '}
								<a href="/register" style={{ color: "#30a5e8", textDecoration: "underline", fontWeight: 600 }}>Regístrate aquí</a>
							</div>
							<button type="submit" style={styles.button}>Ingresar</button>
				</form>
			</div>
		);
}

    const styles = {
	page: {
		minHeight: "100vh",
		width: "100vw",
		backgroundImage: `url(${loginIm})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		backgroundAttachment: "fixed",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},  
	card: {
		width: "100%", 
		maxWidth: 550, 
		minHeight: "100vh",
		background: "rgba(15, 16, 26, 0.35)", // Fondo más transparente
		paddingTop: 20,
		paddingBottom: 40,
		paddingLeft: 24,
		paddingRight: 24, 
		borderRadius: 12,
		boxShadow: "0 10px 30px rgba(0,0,0,.2)",
		fontFamily: "Montserrat",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		backdropFilter: "blur(16px)", // <-- Agrega el blur aquí
		WebkitBackdropFilter: "blur(16px)", // Para compatibilidad con Safari
	},
	title: { margin: 0, marginBottom: 20, fontSize: 28, color: "#fff", textAlign: "center" },
	field: { marginBottom: 18, width: "100%" },
	label: { fontSize: 14, color: "#bababaff", marginBottom: 6, display: "block" },
	error: { color: "#dc2626", fontSize: 13, marginTop: 6 },
	input: {
		width: "100%",
		padding: "10px 12px",
		borderRadius: 10,
		border: "2px solid #cbd5e1",
		outline: "none",
		fontSize: 14,
		background: "white"
	},
	button: {
		marginTop: 12,
		width: "100%",
		padding: "12px 14px",
		borderRadius: 10,
		border: "none",
		background: "#30a5e8ff",
		color: "white",
		fontWeight: 600,
		cursor: "pointer",
		fontSize: 16
	}
};


