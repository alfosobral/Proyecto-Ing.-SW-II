import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  function logOut() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwt_expires");
    sessionStorage.removeItem("jwt");
    window.location.href = "/login";
  }

  return (
    <nav style={styles.navbar}>
      {/* Botón hamburguesa y logOut */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: "100%" }}>
        <button onClick={toggleMenu} style={styles.menuButton} aria-label="Abrir menú">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div style={{ ...styles.logo, display: "flex", alignItems: "center", height: "100%" }}>
          <img src="/HurryHandHorizontal.png" alt="HurryHand Logo" style={{ height: "40px", verticalAlign: "middle", display: "block", margin: "0 auto" }} />
        </div>
      </div>

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
        {(() => {
          const hasToken = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
          const [dropdownOpen, setDropdownOpen] = useState(false);
          if (hasToken) {
            return (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  style={{ ...styles.link, ...styles.button, padding: 0, background: "none", border: "none" }}
                >
                  <img src="/src/assets/profile.png" alt="Perfil" style={{ height: "32px", width: "32px", borderRadius: "50%", verticalAlign: "middle" }} />
                </button>
                {dropdownOpen && (
                  <div style={styles.dropdownMenu}>
                    <button
                      onClick={() => { window.location.href = '/perfil'; setDropdownOpen(false); }}
                      style={{ ...styles.sideLink, width: "100%", color: "#ffffffff", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}
                    >
                      Ir al perfil
                    </button>
                    <button
                      onClick={() => { window.location.href = '/credential'; setDropdownOpen(false); }}
                      style={{ ...styles.sideLink, width: "100%", color: "#ffffffff", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}
                    >
                      Mis credenciales
                    </button>
                    <button
                      onClick={logOut}
                      style={{ ...styles.sideLink, width: "100%", color: "#ffffffff", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <Link to="/login" style={{ ...styles.link, ...styles.button }}>Ingresar</Link>
            );
          }
        })()}
      </div>
    </nav>
  );
}

function handleSearch(query) {
  console.log("Buscar:", query);
}

const styles = {
  dropdownMenu: {
    position: "absolute",
    top: "110%",
    right: 0,
    width: 200,
    height: "auto",
    minWidth: 140,
    zIndex: 1002,
    boxShadow: "0 2px 8px rgba(6, 6, 39, 0.12)",
    background: "#34aadc76",
    borderRadius: 4,
    willChange: "transform",
    transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
  },
  navbar: {
    width: "100%",
    height: "12vh",
    background: "rgba(13, 14, 17, 0.35)",
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
    backgroundColor: "#34aadcff",
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

