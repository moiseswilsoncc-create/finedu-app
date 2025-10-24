import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegistroUsuario: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("✅ Componente RegistroUsuario montado");
  }, []);

  const existeCorreo = async (correo: string) => {
    const response = await fetch(`https://ftsbnorudtcyrrubutt.supabase.co/rest/v1/usuarios?correo=eq.${correo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": "TU_API_KEY",
        "Authorization": "Bearer TU_BEARER_TOKEN"
      }
    });

    const data = await response.json();
    return data.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const yaExiste = await existeCorreo(correo);
      if (yaExiste) {
        setError("Este correo ya está registrado.");
        return;
      }

      const response = await fetch("https://ftsbnorudtcyrrubutt.supabase.co/rest/v1/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "TU_API_KEY",
          "Authorization": "Bearer TU_BEARER_TOKEN",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          correo,
          contraseña,
          nombre,
          ciudad,
          comuna,
          fechaNacimiento,
          created_at: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("logueado", "true");
        localStorage.setItem("tipoUsuario", "usuario");
        navigate("/felicitacion");
      } else {
        setError("No se pudo registrar el usuario.");
      }
    } catch (err) {
      console.error("❌ Error al guardar usuario:", err);
      setError("Error de conexión con Supabase.");
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "2rem",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#3498db", marginBottom: "1rem" }}>📝 Ficha de ingreso</h2>
      <p style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.05rem", color: "#555" }}>
        Regístrate gratis y comienza a construir tu autonomía financiera con Finedu.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label>📧 Correo electrónico</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={inputStyle} />
        </div>

        <div>
          <label>🔒 Clave personal</label>
          <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required style={inputStyle} />
        </div>

        <div>
          <label>👤 Nombre completo</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={inputStyle} />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label>🏙️ Ciudad</label>
            <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>🏘️ Comuna</label>
            <input type="text" value={comuna} onChange={(e) => setComuna(e.target.value)} required style={inputStyle} />
          </div>
        </div>

        <div>
          <label>📅 Fecha de nacimiento</label>
          <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required style={inputStyle} />
        </div>

        <button type="submit" style={{
          padding: "0.8rem",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: "pointer"
        }}>
          ✅ Registrarme ahora
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "0.3rem"
};

export default RegistroUsuario;
