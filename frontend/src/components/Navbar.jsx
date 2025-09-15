import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav style={styles.navbar}>
      {/* Botón hamburguesa */}
      <button onClick={toggleMenu} style={styles.menuButton} aria-label="Abrir menú">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <div style={styles.logo}>HurryHand</div>

      <SearchBar onSearch={handleSearch} />

      {/* Overlay (click para cerrar) 
      <div
        onClick={closeMenu}
        style={{
          ...styles.overlay,
          pointerEvents: menuOpen ? "auto" : "none",
          opacity: menuOpen ? 1 : 0,
        }}
      />
      */}

      <aside
        style={{
          ...styles.sidePanel,
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        aria-hidden={!menuOpen}
      >
        <a href="/" style={styles.sideLink} onClick={closeMenu}>Inicio</a>
        <a href="/servicios" style={styles.sideLink} onClick={closeMenu}>Servicios</a>
        <a href="/contacto" style={styles.sideLink} onClick={closeMenu}>Contacto</a>
      </aside>

      <div style={styles.actions}>
        <Link to="/login" style={{ ...styles.link, ...styles.button }}>Ingresar</Link>
      </div>
    </nav>
  );
}

function handleSearch(query) {
  console.log("Buscar:", query);
}

const styles = {
  navbar: {
    width: "100%",
    height: "12vh",
    background: "rgba(15, 16, 26, 0.35)",
    display: "flex",
    flexdirection: "row",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
    fontFamily: "Montserrat",
    justifyContent: "space-between",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    padding: "0 40px",
    color: "white",
    position: "fixed", // siempre arriba
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  actions: {
    display: "flex",
    gap: "16px",
  },
  button: {
    padding: "6px 14px",
    backgroundColor: "#42b3fd",
    borderRadius: "6px",
  },
  menuButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 24,
    cursor: "pointer",
    marginRight: "14px",
    
  },
   overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    transition: "opacity 280ms ease",  // fade suave
    zIndex: 999, // debajo del panel (1001) y arriba de la navbar (1000) si querés
  },
  sidePanel: {
    position: "fixed",
    top: "12vh", // debajo de la navbar
    left: 0,
    height: "88vh",
    width: 200,
    background: "#111827",
    boxShadow: "2px 0 18px rgba(0,0,0,.35)",
    display: "flex",
    flexDirection: "column",
    padding: "16px 12px",
    zIndex: 1001,
    transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)", // <- EASING
    willChange: "transform",
  },
  sideLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 16,
    transition: "background-color 160ms ease",
  },  
};

