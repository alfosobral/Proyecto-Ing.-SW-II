import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>HurryHand</div>


      <div style={styles.actions}>
        <Link to="/login" style={{ ...styles.link, ...styles.button }}>Ingresar</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: "100%",
    height: "60px",
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
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "24px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color .2s",
  },
  actions: {
    display: "flex",
    gap: "16px",
  },
  button: {
    padding: "6px 14px",
    backgroundColor: "#2563eb",
    borderRadius: "6px",
  }
};
