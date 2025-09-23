import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

/** ======= THEME ======= */
const theme = {
  bg: "#06112e",            // fondo app
  card: "#0c1735",          // fondo card
  cardAlt: "#0e1b42",       // fondo card secundaria
  accent: "#34aadc",        // celeste HurryHand
  text: "#eaf2ff",          // texto base
  textSoft: "#a9bddc",      // texto suave
  border: "2px solid #34aadc",
  radius: 12,
  font: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
};

const styles = {
  page: { minHeight: "100vh", background: theme.bg, fontFamily: theme.font },
  navbar: {
    width: "100%", background: "rgba(13,14,17,0.40)",
    boxShadow: "0 2px 8px #0005", padding: "10px 0",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 10
  },
  navTitle: { flex: 2, textAlign: "center", fontWeight: 700, fontSize: 20, color: theme.text },
  container: { maxWidth: 900, margin: "36px auto", padding: "0 16px" },
  card: {
    background: theme.card, borderRadius: theme.radius, boxShadow: "0 2px 12px #0006",
    padding: 24, color: theme.text
  },
  cardTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 },
  avatarBox: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },
  avatarImg: {
    width: "100%", maxWidth: 260, height: 320, objectFit: "cover",
    borderRadius: 16, border: theme.border, boxShadow: "0 3px 12px #0007", background: "#0b1533"
  },
  uploadDrop: {
    width: "100%", maxWidth: 260, height: 320, borderRadius: 16,
    background: "#0b1533", display: "flex", alignItems: "center", justifyContent: "center",
    border: theme.border, color: theme.accent, cursor: "pointer"
  },
  fieldsBox: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  label: { fontSize: 12, color: theme.textSoft, fontWeight: 600, marginBottom: 6 },
  valueRow: {
    background: theme.cardAlt, borderRadius: 12, padding: "12px 14px",
    border: theme.border, color: theme.text, display: "flex", alignItems: "center", minHeight: 44
  },
  editBtn: {
    background: theme.accent, color: "#06223a", border: "none",
    borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer"
  },
  sectionDivider: { height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" },
  credCard: {
    marginTop: 24, background: theme.card, borderRadius: theme.radius,
    boxShadow: "0 2px 12px #0006", padding: 24, color: theme.text
  },
  input: {
    width: "100%", padding: "12px 14px", borderRadius: 10, border: theme.border,
    background: theme.cardAlt, color: theme.text, outline: "none", minHeight: 44
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
   // Contenedor de la fila (valor + botón)
  fieldRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },

  // La “celda” ahora ocupa todo el ancho de la card
  valueRow: {
    flex: 1,                // <<< clave para ocupar todo el ancho disponible
    width: "100%",
    background: theme.cardAlt,
    borderRadius: 12,
    padding: "8px 12px",
    border: theme.border,
    color: theme.text,
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    wordBreak: "break-word",
  },

  // Botón aparece al final a la derecha
  editBtn: {
    marginLeft: "auto",     // <<< empuja el botón a la derecha
    background: theme.accent,
    color: "#06223a",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};

function FieldRow({ label, value, onEdit }) {
  return (
    <div>
      <div style={styles.label}>{label}</div>

      {/* fila a lo ancho */}
      <div style={styles.fieldRow}>
        {/* celda que ocupa todo el ancho */}
        <div style={styles.valueRow}>
          {value ?? "-"}
        </div>

        {/* botón pegado a la derecha */}
        {onEdit && (
          <button style={styles.editBtn} onClick={onEdit}>
            Editar
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div style={styles.cardTitle}>{title}</div>
      {children}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  // cleanup de la preview
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  // Upload con preview inmediata
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "YOUR_UPLOAD_PRESET");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Falló la subida");
      const data = await res.json();
      if (data.secure_url) {
        setUser((prev) => ({ ...prev, profilePhoto: data.secure_url }));
        URL.revokeObjectURL(objectUrl);
        setPreview(null);
        // opcional: persistir en tu backend con PATCH
        // await fetch(`${API}/api/user/me`, { method:"PATCH", headers:{...}, body: JSON.stringify({ profilePhoto: data.secure_url })})
      }
    } catch (err) {
      console.error(err);
      alert("Error al subir la imagen");
    }
  };

  // Cargar usuario
  useEffect(() => {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    let email = "";
    try { if (token) email = JSON.parse(atob(token.split(".")[1])).sub || JSON.parse(atob(token.split(".")[1])).email || ""; } catch {}
    if (!email) { setError("No se encontró el email en el token"); setLoading(false); return; }

    fetch(`${API}/api/user/email/${email}`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => { if (!r.ok) throw new Error("No se pudo obtener el usuario"); return r.json(); })
      .then(d => { setUser(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>Cargando…</div>;
  if (error) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>Error: {error}</div>;
  if (!user) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>No se encontró el usuario.</div>;

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: 16, marginRight: 16 }}>
            <span style={{ fontSize: 28, color: theme.text }}>&larr;</span>
          </button>
          <img src="/HurryHandHorizontal.png" alt="HurryHand" style={{ height: 40, marginRight: 16 }} />
        </div>
        <div style={styles.navTitle}>Perfil del usuario</div>
        <div style={{ flex: 1 }} />
      </div>

      <div style={styles.container}>
        {/* ===== Card de PERFIL (todo junto) ===== */}
        <div style={styles.card}>
          <Section title="Información personal">
            <div style={styles.grid}>
              {/* Avatar */}
              <div style={styles.avatarBox}>
                {preview || user.profilePhoto ? (
                  <img
                    src={preview || user.profilePhoto}
                    alt="Foto de perfil"
                    onError={(e) => (e.currentTarget.src = "/default-credential.png")}
                    style={styles.avatarImg}
                  />
                ) : (
                  <label htmlFor="profile-upload" style={styles.uploadDrop} title="Subir foto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 16V8m0 0-4 4m4-4 4 4" />
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                    </svg>
                  </label>
                )}
                <input id="profile-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <div style={{ marginTop: 10 }}>
                  <label htmlFor="profile-upload" style={{ ...styles.editBtn, padding: "8px 12px", display: "inline-block" }}>
                    {preview || user.profilePhoto ? "Cambiar foto" : "Subir foto"}
                  </label>
                </div>
              </div>

              {/* Campos */}
              <div style={styles.fieldsBox}>
                <FieldRow label="Nombre" value={user.name} onEdit={() => alert("Editar Nombre")} />
                <FieldRow label="Apellido" value={user.surname} onEdit={() => alert("Editar Apellido")} />
                <FieldRow label="Email" value={user.email} onEdit={() => alert("Editar Email")} />
                <FieldRow label="Fecha de cumpleaños" value={user.birthdate} />
                <FieldRow label="Tipo de ID" value={user.personalIdType} />
                <FieldRow label="Personal ID" value={user.personalId} />
                <FieldRow label="Teléfono" value={user.phoneNumber} onEdit={() => alert("Editar Teléfono")} />
                <div style={styles.sectionDivider} />
                <FieldRow
                  label="Proveedor"
                  value={user.provider ? "Sí" : "No"}
                  onEdit={() => alert("Cambiar Proveedor")}
                />
                {user.location && (
                  <>
                    <div style={styles.sectionDivider} />
                    <FieldRow label="Departamento" value={user.location.departamento} onEdit={() => alert("Editar Departamento")} />
                    <FieldRow label="Barrio" value={user.location.neighbourhood} onEdit={() => alert("Editar Barrio")} />
                    <FieldRow label="Calle y número" value={`${user.location.street} ${user.location.streetNumber}`} onEdit={() => alert("Editar Dirección")} />
                    <FieldRow label="Apto" value={user.location.aptoNumber} onEdit={() => alert("Editar Apto")} />
                    <FieldRow label="Código Postal" value={user.location.postalCode} onEdit={() => alert("Editar CP")} />
                  </>
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* ===== Card de CREDENCIALES (abajo) ===== */}
        <div style={styles.credCard}>
          <div style={styles.cardTitle}>Credenciales</div>
          <form onSubmit={(e) => { e.preventDefault(); alert("Guardar credencial"); }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Título de credencial</div>
                <input style={styles.input} type="text" placeholder="Ej: Electricista profesional" />
              </div>
              <div>
                <div style={styles.label}>URL de imagen (logo)</div>
                <input style={styles.input} type="url" placeholder="https://..." />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={styles.label}>Descripción</div>
              <input style={styles.input} type="text" placeholder="Breve descripción" />
            </div>
            <div style={{ ...styles.row, marginTop: 16 }}>
              <div>
                <div style={styles.label}>Emisor</div>
                <input style={styles.input} type="text" placeholder="Institución" />
              </div>
              <div>
                <div style={styles.label}>Fecha de emisión</div>
                <input style={styles.input} type="date" />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button type="submit" style={styles.editBtn}>Agregar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
