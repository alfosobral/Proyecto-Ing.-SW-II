import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function ProfileNavbar() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home_page");
  };

  return (
    <nav style={styles.navbar}>
      {/* Flecha para volver y logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: "100%" }}>
        <button onClick={handleGoHome} style={styles.backButton} aria-label="Volver al inicio">
          <FaArrowLeft />
        </button>
        <div style={{ ...styles.logo, display: "flex", alignItems: "center", height: "100%" }}>
          <img 
            src="/HurryHandHorizontal.png" 
            alt="HurryHand Logo" 
            style={{ 
              height: "40px", 
              verticalAlign: "middle", 
              display: "block", 
              margin: "0 auto",
              filter: "drop-shadow(2px 2px 4px rgba(223, 222, 222, 0.6)) drop-shadow(-1px -1px 2px rgba(215, 210, 210, 0.2))",
              borderRadius: "10px"
            }} 
          />
        </div>
      </div>
    
      {/* Espacio vacío para mantener el layout */}
      <div style={{ flex: 1 }}></div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "70px",
    background: "#e1dcdc66",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(52, 170, 220, 0.2)",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    zIndex: 1000,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },

  backButton: {
    background: "transparent",
    border: "none",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#ffffffff",
    fontSize: "16px",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "#34aadc",
      color: "#06112e",
    }
  },

  logo: {
    marginLeft: "10px",
  },

  profileHeader: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  profileTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#eaf2ff",
    margin: 0,
    textAlign: "center",
    letterSpacing: "0.5px",
  },
};