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
import ProfileNavbar from "../components/ProfileNavbar";

const theme = {
  bg: "#06112e",
  card: "#0c1735",
  cardAlt: "#0e1b42",
  accent: "#34aadc",
  text: "#eaf2ff",
  textSoft: "#a9bddc",
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
    alignItems: "flex-start",
    padding: "120px 60px 40px 0",
    backgroundAttachment: "fixed",
    fontFamily: theme.font,
  },
  container: {
    maxWidth: 900,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: theme.text,
    marginBottom: 16,
    borderBottom: `1px solid ${theme.accent}`,
    paddingBottom: 8,
    textAlign: "center",
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  fullWidth: { gridColumn: "1 / -1" },
  card: {
    background: theme.card,
    borderRadius: theme.radius,
    boxShadow: "0 2px 12px #0006",
    padding: 24,
    color: theme.text,
  },
  cardTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 },
  avatarBox: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarImg: {
    width: 200,
    height: 250,
    objectFit: "cover",
    borderRadius: 16,
    border: theme.border,
    boxShadow: "0 3px 12px #0007",
    background: "#0b1533",
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
    cursor: "pointer",
  },
  fieldsBox: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  label: { fontSize: 12, color: theme.textSoft, fontWeight: 600, marginBottom: 6 },
  valueRow: {
    background: theme.cardAlt,
    borderRadius: 12,
    padding: "12px 14px",
    border: theme.border,
    color: theme.text,
    display: "flex",
    alignItems: "center",
    minHeight: 44,
  },
  editBtn: {
    background: theme.accent,
    color: "#06223a",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
    marginLeft: 10,
  },
  sectionDivider: { height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" },
  credCard: {
    marginTop: 24,
    background: theme.card,
    borderRadius: theme.radius,
    boxShadow: "0 2px 12px #0006",
    padding: 24,
    color: theme.text,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: theme.border,
    background: theme.cardAlt,
    color: theme.text,
    outline: "none",
    minHeight: 44,
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  fieldRow: { display: "flex", alignItems: "center", gap: 12, width: "100%" },
  valueRowFlex: {
    flex: 1,
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
  editBtnRight: {
    marginLeft: "auto",
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
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingCredential, setSavingCredential] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loadingCredentials, setLoadingCredentials] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    birthdate: "",
    personalIdType: "",
    personalId: "",
    phoneNumber: "",
    countryCode: "+598", // Código de país por defecto
    provider: false,
    credentialTitle: "",
    credentialImageUrl: "",
    credentialDescription: "",
    credentialIssuer: "",
    credentialDate: "",
    credentialExpiryDate: "",
  });

  // Lista de países disponibles
  const countries = [
    { code: "+598", name: "Uruguay", flag: "🇺🇾" },
    { code: "+54", name: "Argentina", flag: "🇦🇷" },
    { code: "+55", name: "Brasil", flag: "🇧🇷" },
    { code: "+1", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "+34", name: "España", flag: "🇪🇸" },
  ];

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const loadCredentials = async () => {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    try {
      const res = await fetch(`${API}/api/credential/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudieron cargar las credenciales");
      const data = await res.json();
      setCredentials(data || []);
    } catch (err) {
      console.error("Error al cargar credenciales:", err);
      setCredentials([]);
    } finally {
      setLoadingCredentials(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "YOUR_UPLOAD_PRESET");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Falló la subida");
      const data = await res.json();
      if (data.secure_url) {
        setUser((prev) => ({ ...prev, profilePhoto: data.secure_url }));
        URL.revokeObjectURL(objectUrl);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error al subir la imagen");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    let email = "";
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        email = payload.sub || payload.email || "";
      }
    } catch {}
    if (!email) {
      setError("No se encontró el email en el token");
      setLoading(false);
      return;
    }

    fetch(`${API}/api/user/email/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo obtener el usuario");
        return r.json();
      })
      .then((d) => {
        setUser(d);
        
        let countryCode = "+598"; 
        let phoneNumber = d.phoneNumber || "";
        
        if (d.phoneNumber) {
          const matchedCountry = countries.find(country => 
            d.phoneNumber.startsWith(country.code)
          );
          
          if (matchedCountry) {
            countryCode = matchedCountry.code;
            phoneNumber = d.phoneNumber.substring(matchedCountry.code.length);
          }
        }

        setOriginal({
          name: d.name || "",
          surname: d.surname || "",
          email: d.email || "",
          phoneNumber: d.phoneNumber || "", 
          provider: d.provider || false,
        });
        
        setFormData({
          name: d.name || "",
          surname: d.surname || "",
          email: d.email || "",
          currentPassword: "",
          newPassword: "",
          birthdate: d.birthdate || "",
          personalIdType: d.personalIdType || "",
          personalId: d.personalId || "",
          phoneNumber: phoneNumber, // Solo el número sin código
          countryCode: countryCode, // El código de país separado
          provider: d.provider || false,
          credentialTitle: "",
          credentialImageUrl: "",
          credentialDescription: "",
          credentialIssuer: "",
          credentialDate: "",
          credentialExpiryDate: "",
        });
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });

    loadCredentials();
  }, []);

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Función para manejar el cambio de país en PhoneField
  const handleCountryChange = (countryCode) => {
    setFormData(prev => ({ ...prev, countryCode }));
  };

  // Función para combinar código de país + número
  const getFullPhoneNumber = () => {
    if (!formData.phoneNumber) return formData.countryCode;
    return `${formData.countryCode}${formData.phoneNumber}`;
  };

  async function patchJson(path, payload) {
    const liveToken = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    const res = await fetch(`${API}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${liveToken}`,
      },
      body: JSON.stringify(payload),
    });
    const raw = await res.text().catch(() => "");
    if (!res.ok) {
      console.error("[PATCH][FAIL]", path, res.status, raw);
      const msg = raw || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return { message: raw };
    }
  }

  const handleProviderChange = async (newProviderValue) => {
    if (!newProviderValue || user.provider) {
      handleInputChange("provider", newProviderValue);
      return;
    }

    const confirmed = confirm("¿Estás seguro de que quieres registrarte como proveedor de servicios?");
    if (!confirmed) {
      return; 
    }

    try {
      const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
      const res = await fetch(`${API}/api/provider`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP ${res.status}`);
      }

      const response = await res.json();
      console.log("Provider response:", response);
      
      handleInputChange("provider", true);
      setUser(prev => ({ ...prev, provider: true }));
      setOriginal(prev => ({ ...prev, provider: true }));
      
      alert("Te has registrado como proveedor de servicios exitosamente");

    } catch (error) {
      console.error("Error al registrarse como provider:", error);
      alert("Error al registrarse como proveedor: " + error.message);
      handleInputChange("provider", false);
    }
  };

  const handleAddCredential = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

    if (!formData.credentialTitle || !formData.credentialIssuer || !formData.credentialDate) {
      alert("Por favor completa: Título, Emisor y Fecha de emisión");
      return;
    }
    if (!user?.provider) {
      alert("Debes ser proveedor para agregar credenciales. Activa el modo proveedor y vuelve a iniciar sesión si es necesario.");
      return;
    }

    setSavingCredential(true);
    try {
      const payload = {
        name: formData.credentialTitle,
        issuer: formData.credentialIssuer,
        description: formData.credentialDescription || null,
        validUntil: formData.credentialExpiryDate || null,
        issuedAt: formData.credentialDate,
        startedAt: formData.credentialDate,
        completedAt: formData.credentialDate,
        certificateUrl: formData.credentialImageUrl || null,
        credentialStatus: "VERIFIED",
      };

      const res = await fetch(`${API}/api/credential`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        alert("No tienes permisos para crear credenciales. Asegúrate de tener el rol PROVIDER (re-inicia sesión si te acabas de registrar).");
        return;
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP ${res.status}`);
      }

      const created = await res.json();                 
      setCredentials(prev => [...prev, created]);       

      setFormData(prev => ({
        ...prev,
        credentialTitle: "",
        credentialImageUrl: "",
        credentialDescription: "",
        credentialIssuer: "",
        credentialDate: "",
        credentialExpiryDate: "",
      }));

      alert("Credencial agregada correctamente");
    } catch (err) {
      console.error("Error al agregar credencial:", err);
      alert("Error al agregar credencial: " + err.message);
    } finally {
      setSavingCredential(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!original) return;

    setSaving(true);

    const name = (formData.name ?? "").trim();
    const surname = (formData.surname ?? "").trim();
    const email = (formData.email ?? "").trim();
    const currentPassword = (formData.currentPassword ?? ""); 
    const newPassword = (formData.newPassword ?? "");         
    const fullPhoneNumber = getFullPhoneNumber().trim();
    const originalFullPhone = (original.phoneNumber ?? "").trim();

    const steps = [];
    if (name !== (original.name ?? "")) {
      steps.push({ field: "name", run: () => patchJson("/api/user/name", { name }) });
    }
    if (surname !== (original.surname ?? "")) {
      steps.push({ field: "surname", run: () => patchJson("/api/user/surname", { surname }) });
    }
    if (email !== (original.email ?? "")) {
      steps.push({ field: "email", run: () => patchJson("/api/user/email", { email }) });
    }

    if (newPassword && newPassword.length > 0) {
      if (!currentPassword || currentPassword.length === 0) {
        alert("Por favor ingresa tu contraseña actual para cambiarla");
        setSaving(false);
        return;
      }
      
      if (currentPassword === newPassword) {
        alert("La nueva contraseña debe ser diferente a la actual");
        setSaving(false);
        return;
      }
      
      if (newPassword.length < 6) {
        alert("La nueva contraseña debe tener al menos 6 caracteres");
        setSaving(false);
        return;
      }
      
      steps.push({
        field: "password",
        run: () => patchJson("/api/user/password", {
          currentPassword: currentPassword, 
          newPassword: newPassword         
        }),
      });
    }

    if (fullPhoneNumber !== originalFullPhone) {
      steps.push({ field: "phoneNumber", run: () => patchJson("/api/user/phone", { phoneNumber: fullPhoneNumber }) });
    }

    if (steps.length === 0) {
      alert("No hay cambios para guardar");
      setSaving(false);
      return;
    }

    try {
      const successfulFields = [];
      const failedFields = [];

      for (const step of steps) {
        try {
          await step.run();
          successfulFields.push(step.field);
        } catch (err) {
          failedFields.push({ field: step.field, error: err?.message || String(err) });
        }
      }

      if (successfulFields.length > 0) {
        const newOriginal = { ...original };
        const newUser = user ? { ...user } : user;

        for (const f of successfulFields) {
          if (f === "name") {
            newOriginal.name = name;
            if (newUser) newUser.name = name;
          }
          if (f === "surname") {
            newOriginal.surname = surname;
            if (newUser) newUser.surname = surname;
          }
          if (f === "email") {
            newOriginal.email = email;
            if (newUser) newUser.email = email;
          }
          if (f === "password") {
            setFormData(prev => ({
              ...prev,
              currentPassword: "",
              newPassword: ""
            }));
          }
          if (f === "phoneNumber") {
            newOriginal.phoneNumber = fullPhoneNumber;
            if (newUser) newUser.phoneNumber = fullPhoneNumber;
          }
        }

        setOriginal(newOriginal);
        setUser(newUser);
      }

      if (failedFields.length === 0) {
        alert("Todos los cambios guardados correctamente");
      } else {
        const msg = failedFields.map(f => `• ${f.field}: ${f.error}`).join("\n");
        alert(`${successfulFields.length} de ${steps.length} cambios guardados.\nFallaron:\n${msg}`);
      }
    } catch (err) {
      console.error("💥 Error inesperado:", err);
      alert("💥 Error inesperado al guardar. Revisá la consola.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>Cargando…</div>;
  if (error) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>Error: {error}</div>;
  if (!user) return <div style={{ color: theme.text, padding: 24, fontFamily: theme.font }}>No se encontró el usuario.</div>;

  return (
    <div style={styles.page}>
      <ProfileNavbar />

      <div style={styles.container}>
        {/* Card principal con información personal */}
        <Card>
          <div style={styles.sectionTitle}>Perfil del Usuario</div>

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
            <SubmitButton onClick={() => document.getElementById("profile-upload").click()} style={{ marginTop: 10, width: "auto" }}>
              {preview || user?.profilePhoto ? "Cambiar foto" : "Subir foto"}
            </SubmitButton>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.gridRow}>
              <InputField
                id="name"
                label="Nombre"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ingrese su nombre"
              />
              <InputField
                id="surname"
                label="Apellido"
                value={formData.surname}
                onChange={(e) => handleInputChange("surname", e.target.value)}
                placeholder="Ingrese su apellido"
              />
            </div>

            <div style={styles.gridRow}>
              <div style={styles.fullWidth}>
                <InputField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Ingrese su email"
                disabled={true}
              />
              </div>
            </div>  
            <div style={styles.gridRow}>
              <InputField
                id="currentPassword"
                label="Contraseña Actual"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                disabled={false}
              />
              <InputField
                id="newPassword"
                label="Nueva Contraseña"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                disabled={false}
              />
            </div>
            
            <div style={styles.gridRow}>
              <DateField 
                id="birthdate" 
                label="Fecha de nacimiento" 
                value={formData.birthdate} 
                onChange={(e) => handleInputChange("birthdate", e.target.value)}
                disabled={true}
              />
              <SelectField
                id="provider"
                label="¿Es proveedor de servicios?"
                value={String(user.provider ? true : formData.provider)}
                onChange={(e) => handleProviderChange(e.target.value === "true")}
                options={[
                  { value: "false", label: "No" },
                  { value: "true", label: "Sí" },
                ]}
                disabled={user.provider}
              />
            </div>
            
            <div style={styles.gridRow}>
              <SelectField
                id="personalIdType"
                label="Tipo de ID"
                value={formData.personalIdType}
                onChange={(e) => handleInputChange("personalIdType", e.target.value)}
                options={[
                  { value: "cedula", label: "Cédula" },
                  { value: "pasaporte", label: "Pasaporte" },
                  { value: "dni", label: "DNI" },
                ]}
                disabled={true}
              />
              <InputField
                id="personalId"
                label="Número de ID"
                value={formData.personalId}
                onChange={(e) => handleInputChange("personalId", e.target.value)}
                placeholder="Ingrese su número de ID"
                disabled={true}
              />
            </div>

            <div style={styles.gridRow}>
              <div style={styles.fullWidth}>
                <PhoneField
                id="phoneNumber"
                label="Teléfono"
                value={formData.phoneNumber}
                selectedCountry={formData.countryCode}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                onCountryChange={handleCountryChange}
                placeholder="Ingrese su teléfono"
              />
              </div>
            </div>

            <SubmitButton type="submit" style={{ marginTop: 20 }} disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </SubmitButton>
          </form>
        </Card>

        {/* Card de credenciales existentes */}
        {!loadingCredentials && credentials.length > 0 && (
          <Card>
            <div style={styles.sectionTitle}>Mis Credenciales</div>
            <div style={{ display: "grid", gap: 16 }}>
              {credentials.map((credential) => (
                <div
                  key={credential.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: 16,
                    padding: 16,
                    background: theme.cardAlt,
                    borderRadius: 12,
                    border: theme.border,
                  }}
                >
                  {/* Imagen/Logo de la credencial */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      background: theme.card,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${theme.accent}`,
                    }}
                  >
                    {credential.certificateUrl ? (
                      <img
                        src={credential.certificateUrl}
                        alt={credential.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        display: credential.certificateUrl ? "none" : "flex",
                        color: theme.textSoft,
                        fontSize: 12,
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >                
                    </div>
                  </div>

                  {/* Información de la credencial */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <h4 style={{ margin: 0, color: theme.text, fontSize: 16, fontWeight: 600 }}>
                      {credential.name}
                    </h4>
                    <p style={{ margin: 0, color: theme.textSoft, fontSize: 14 }}>
                      <strong>Emisor:</strong> {credential.issuer}
                    </p>
                    {credential.description && (
                      <p style={{ margin: 0, color: theme.textSoft, fontSize: 13 }}>
                        {credential.description}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: theme.textSoft }}>
                      <span>
                        <strong>Emitida:</strong> {new Date(credential.issuedAt).toLocaleDateString('es-ES')}
                      </span>
                      {credential.validUntil && (
                        <span>
                          <strong>Vence:</strong> {new Date(credential.validUntil).toLocaleDateString('es-ES')}
                        </span>
                      )}
                      <span
                        style={{
                          background: credential.credentialStatus === 'VERIFIED' ? '#16a34a' : '#fbbf24',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 11,
                        }}
                      >
                        {credential.credentialStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Card de agregar credenciales */}
        <Card>
          <div style={styles.sectionTitle}>Agregar Credencial</div>
          <form onSubmit={handleAddCredential}>
            {/* Título + URL imagen */}
            <div style={styles.gridRow}>
              <InputField
                id="credentialTitle"
                label="Título de credencial"
                value={formData.credentialTitle}
                onChange={(e) => handleInputChange("credentialTitle", e.target.value)}
                placeholder="Ej: Electricista profesional"
                required
              />
              <InputField
                id="credentialImageUrl"
                label="URL de imagen (logo)"
                type="url"
                value={formData.credentialImageUrl}
                onChange={(e) => handleInputChange("credentialImageUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Descripción */}
            <TextAreaField
              id="credentialDescription"
              label="Descripción"
              value={formData.credentialDescription}
              onChange={(e) => handleInputChange("credentialDescription", e.target.value)}
              placeholder="Breve descripción de la credencial"
            />

            {/* Emisor a todo el ancho */}
            <InputField
              id="credentialIssuer"
              label="Emisor"
              value={formData.credentialIssuer}
              onChange={(e) => handleInputChange("credentialIssuer", e.target.value)}
              placeholder="Institución emisora"
              required
            />

            {/* Fechas lado a lado */}
            <div style={styles.gridRow}>
              <DateField
                id="credentialDate"
                label="Fecha de emisión"
                value={formData.credentialDate}
                onChange={(e) => handleInputChange("credentialDate", e.target.value)}
                required
              />
              <DateField
                id="credentialExpiryDate"
                label="Fecha de vencimiento"
                value={formData.credentialExpiryDate}
                onChange={(e) => handleInputChange("credentialExpiryDate", e.target.value)}
              />
            </div>

            <SubmitButton type="submit" style={{ marginTop: 20 }} disabled={savingCredential}>
              {savingCredential ? "Agregando..." : "Agregar Credencial"}
            </SubmitButton>
          </form>
        </Card>
        {/* Card de agregar servicios - solo para proveedores*/}
        {user?.provider && (
          <Card>
            <div style={styles.sectionTitle}>Servicio profesional</div>            
              <SubmitButton
                onClick={() => navigate("/service_post2")}
              >Agregar Servicios
              </SubmitButton>          
          </Card>
        )}
      </div>
    </div>
  );
}