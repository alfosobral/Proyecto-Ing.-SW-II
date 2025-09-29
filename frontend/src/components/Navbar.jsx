import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";


const NAV_H = "12vh";
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = "500ms";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // ← súbelo acá

  const hasToken = Boolean(localStorage.getItem("jwt") || sessionStorage.getItem("jwt"));

  function logOut() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwt_expires");
    sessionStorage.removeItem("jwt");
    window.location.href = "/login";
  }

  return (
    <nav style={styles.navbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: "100%" }}>
        <button onClick={() => setMenuOpen(p => !p)} style={styles.menuButton} aria-label="Abrir menú">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <SearchBar onSearch={handleSearch} />

      {/* LEFT PANEL (siempre montado) */}
      <aside
        style={{
          ...styles.panelBase,
          ...styles.leftPos,
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        aria-hidden={!menuOpen}
      >
        <a href="/service_post" style={styles.sideLink} onClick={() => setMenuOpen(false)}>Servicios</a>
        <a href="/contacto" style={styles.sideLink} onClick={() => setMenuOpen(false)}>Contacto</a>
        <a href="/calendar" style={styles.sideLink} onClick={() => setMenuOpen(false)}>Mi calendario</a>
      </aside>

      <div style={styles.actions}>
        {hasToken ? (
          <>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                style={{ ...styles.button, padding: 12, background: "none", border: "none" }}
              >
                <FaUserCircle style={{ fontSize: 32, color: "white" }} />
              </button>
            </div>

            {/* RIGHT PANEL (siempre montado) */}
            <aside
              style={{
                ...styles.panelBase,
                ...styles.rightPos,
                transform: dropdownOpen ? "translateX(0)" : "translateX(100%)",
              }}
              aria-hidden={!dropdownOpen}
            >
              <button onClick={() => (window.location.href = "/profile")} style={{ ...styles.sideLink, textAlign: "left", background: "none", border: "none" }}>
                Ir al perfil
              </button>
              <button onClick={logOut} style={{ ...styles.sideLink, textAlign: "left", background: "none", border: "none" }}>
                Cerrar sesión
              </button>
            </aside>
          </>
        ) : (
          <Link to="/login" style={{ ...styles.button }}>Ingresar</Link>
        )}
      </div>
    </nav>
  );
}

function handleSearch(q) { console.log("Buscar:", q); }

const styles = {
  navbar: {
    width: "100%",
    height: NAV_H,
    background: "rgba(225, 220, 220, 0.4)",
    display: "flex",
    flexDirection: "row", // ← ojo: estaba mal escrito
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
    fontFamily: "Montserrat",
    justifyContent: "space-between",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    padding: "0 40px",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
  },

  button: {
    marginRight: "14px",
    backgroundColor: "transparent", // ← en CSS no existe "none" para color
    borderRadius: "6px",
    padding: "12px",
    background: "rgba(225, 220, 220, 0.4)",
  },

  panelBase: {
    position: "fixed",
    top: NAV_H,                                        // alinea con navbar
    height: `calc(100vh - ${NAV_H})`,
    width: 240,
    background: "rgba(199, 216, 219, 0.72)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    boxShadow: "none",
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    zIndex: 1001,
    transition: `transform ${DURATION} ${EASING}`,     // ← misma animación
    willChange: "transform",
  },
  leftPos: { left: 0 },
  rightPos: { right: 0 },

  sideLink: {
    color: "#7f7d7dff",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 16,
    transition: "background-color 160ms ease",
    cursor: "pointer",
  },

  menuButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 24,
    cursor: "pointer",
    marginLeft: "14px",
  },
};
