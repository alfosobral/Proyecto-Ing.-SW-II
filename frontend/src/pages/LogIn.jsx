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

	function onChange(e) {
		const { name, value } = e.target;
		setForm(f => ({ ...f, [name]: value }));
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
						style={styles.input}
						placeholder="tu@email.com"
					/>
				</div>
				<div style={styles.field}>
								<label style={styles.label} htmlFor="password">Contraseña</label>
								<div style={{ position: "relative" }}>
									<input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										value={form.password}
										onChange={onChange}
										style={{ ...styles.input, paddingRight: 36 }}
										placeholder="••••••••"
									/>
									<span
										onClick={() => setShowPassword(s => !s)}
										style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#bababaff", fontSize: 20 }}
									>
										{showPassword ? <FaEyeSlash /> : <FaEye />}
									</span>
								</div>
				</div>
				{error && <p style={styles.error}>{error}</p>}
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
		maxWidth: 480,
		background: "rgba(15, 16, 26, 0.81)",
		padding: 32,
		borderRadius: 12,
		boxShadow: "0 10px 30px rgba(0,0,0,.2)",
		fontFamily: "Montserrat",
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
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


