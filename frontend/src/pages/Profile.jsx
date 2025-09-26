import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import background from "../assets/Background.png";
import Card from "../components/Card";
import InputField from "../components/InputField";
import SubmitButton from "../components/SummbitButton";
import DateField from "../components/DateField";
import SelectField from "../components/SelectField";
import PhoneField from "../components/PhoneField";
import TextAreaField from "../components/TextAreaField";

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
  page: {
    minHeight: "85vh",
    width: "100vw",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 60px 40px 0",
    backgroundAttachment: "fixed",
    fontFamily: theme.font
  },
  container: { 
    maxWidth: 900, 
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: theme.text,
    marginBottom: 16,
    borderBottom: `1px solid ${theme.accent}`,
    paddingBottom: 8,
    textAlign: "center"
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 16
  },
  fullWidth: {
    gridColumn: "1 / -1"
  },
  card: {
    background: theme.card, borderRadius: theme.radius, boxShadow: "0 2px 12px #0006",
    padding: 24, color: theme.text
  },
  cardTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 },
  avatarBox: { 
    width: "100%", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    marginBottom: 20
  },
  avatarImg: {
    width: 200,
    height: 250,
    objectFit: "cover",
    borderRadius: 16,
    border: theme.border,
    boxShadow: "0 3px 12px #0007",
    background: "#0b1533"
  },
  uploadDrop: {
    width: 200,
    height: 250,
    borderRadius: 16,
    background: "#ffffff77",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: theme.border,
    color: theme.accent,
    cursor: "pointer"
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

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    birthdate: '',
    personalIdType: '',
    personalId: '',
    phoneNumber: '',
    provider: false,
    credentialTitle: '',
    credentialImageUrl: '',
    credentialDescription: '',
    credentialIssuer: '',
    credentialDate: ''
  });
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

  // Cargar usuario y llenar formData
  useEffect(() => {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    let email = "";
    try { if (token) email = JSON.parse(atob(token.split(".")[1])).sub || JSON.parse(atob(token.split(".")[1])).email || ""; } catch {}
    if (!email) { setError("No se encontró el email en el token"); setLoading(false); return; }

    fetch(`${API}/api/user/email/${email}`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => { if (!r.ok) throw new Error("No se pudo obtener el usuario"); return r.json(); })
      .then(d => { 
        setUser(d); 
        setFormData({
          name: d.name || '',
          surname: d.surname || '',
          email: d.email || '',
          birthdate: d.birthdate || '',
          personalIdType: d.personalIdType || '',
          personalId: d.personalId || '',
          phoneNumber: d.phoneNumber || '',
          provider: d.provider || false,
          credentialTitle: '',
          credentialImageUrl: '',
          credentialDescription: '',
          credentialIssuer: '',
          credentialDate: ''
        });
        setLoading(false); 
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const handleInputChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Guardando cambios...");
    // Aquí iría la lógica para enviar al backend
  };

  if (loading) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>Cargando…</div>;
  if (error) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>Error: {error}</div>;
  if (!user) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>No se encontró el usuario.</div>;

  return (
    <div style={styles.page}>
      
      
      <div style={styles.container}>
        {/* Card principal con información personal */}
        <Card>
          <div style={styles.sectionTitle}>Información Personal</div>
          
          {/* Avatar */}
          <div style={styles.avatarBox}>
            {preview || user?.profilePhoto ? (
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
            <SubmitButton
              onClick={() => document.getElementById('profile-upload').click()}
              style={{ marginTop: 10, width: 'auto' }}
            >
              {preview || user?.profilePhoto ? "Cambiar foto" : "Subir foto"}
            </SubmitButton>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.gridRow}>
              <InputField
                id="name"
                label="Nombre"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ingrese su nombre"
              />
              <InputField
                id="surname"
                label="Apellido"
                value={formData.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                placeholder="Ingrese su apellido"
              />
            </div>

            <div style={styles.gridRow}>
              <InputField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Ingrese su email"
              />
              <DateField
                id="birthdate"
                label="Fecha de nacimiento"
                value={formData.birthdate}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
              />
            </div>

            <div style={styles.gridRow}>
              <SelectField
                id="personalIdType"
                label="Tipo de ID"
                value={formData.personalIdType}
                onChange={(e) => handleInputChange('personalIdType', e.target.value)}
                options={[
                  { value: '', label: 'Seleccione tipo de ID' },
                  { value: 'cedula', label: 'Cédula' },
                  { value: 'pasaporte', label: 'Pasaporte' },
                  { value: 'dni', label: 'DNI' }
                ]}
              />
              <InputField
                id="personalId"
                label="Número de ID"
                value={formData.personalId}
                onChange={(e) => handleInputChange('personalId', e.target.value)}
                placeholder="Ingrese su número de ID"
              />
            </div>

            <div style={styles.gridRow}>
              <PhoneField
                id="phoneNumber"
                label="Teléfono"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Ingrese su teléfono"
              />
              <SelectField
                id="provider"
                label="¿Es proveedor de servicios?"
                value={formData.provider}
                onChange={(e) => handleInputChange('provider', e.target.value === 'true')}
                options={[
                  { value: false, label: 'No' },
                  { value: true, label: 'Sí' }
                ]}
              />
            </div>

            <SubmitButton type="submit" style={{ marginTop: 20 }}>
              Guardar Cambios
            </SubmitButton>
          </form>
        </Card>

        {/* Card de credenciales */}
        <Card>
          <div style={styles.sectionTitle}>Agregar Credencial</div>
          <form onSubmit={(e) => { e.preventDefault(); alert("Guardar credencial"); }}>
            <div style={styles.gridRow}>
              <InputField
                id="credentialTitle"
                label="Título de credencial"
                value={formData.credentialTitle}
                onChange={(e) => handleInputChange('credentialTitle', e.target.value)}
                placeholder="Ej: Electricista profesional"
              />
              <InputField
                id="credentialImageUrl"
                label="URL de imagen (logo)"
                type="url"
                value={formData.credentialImageUrl}
                onChange={(e) => handleInputChange('credentialImageUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <TextAreaField
              id="credentialDescription"
              label="Descripción"
              value={formData.credentialDescription}
              onChange={(e) => handleInputChange('credentialDescription', e.target.value)}
              placeholder="Breve descripción de la credencial"
              
            />

            <div style={styles.gridRow}>
              <InputField
                id="credentialIssuer"
                label="Emisor"
                value={formData.credentialIssuer}
                onChange={(e) => handleInputChange('credentialIssuer', e.target.value)}
                placeholder="Institución emisora"
              />
              <DateField
                id="credentialDate"
                label="Fecha de emisión"
                value={formData.credentialDate}
                onChange={(e) => handleInputChange('credentialDate', e.target.value)}
              />
            </div>

            <SubmitButton type="submit" style={{ marginTop: 20 }}>
              Agregar Credencial
            </SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
