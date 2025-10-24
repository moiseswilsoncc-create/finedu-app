import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegistroUsuario: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [ingresos, setIngresos] = useState("");
  const [egresos, setEgresos] = useState("");
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
    console.log("🚀 Enviando datos...");

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
          ingresos: parseInt(ingresos),
          egresos: parseInt(egresos),
          created_at: new Date().toISOString()
        })
      });

      const data = await response.json();
      console.log("📦 Status:", response.status);
      console.log("📨 Respuesta Supabase:", data);

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
      maxWidth: "500px",
      margin: "2rem auto",
      padding: "1.5rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📝 Ficha de ingreso</h2>
      <form onSubmit={handleSubmit}>
        <label>Correo:</label>
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />

        <label>Contraseña:</label>
        <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />

        <label>Nombre completo:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <label>Ciudad:</label>
        <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />

        <label>Comuna:</label>
        <input type="text" value={comuna} onChange={(e) => setComuna(e.target.value)} required />

        <label>Fecha de nacimiento:</label>
        <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />

        <label>Ingresos mensuales:</label>
        <input type="number" value={ingresos} onChange={(e) => setIngresos(e.target.value)} required />

        <label>Egresos mensuales:</label>
        <input type="number" value={egresos} onChange={(e) => setEgresos(e.target.value)} required />

        <button type="submit" style={{
          marginTop: "1rem",
          width: "100%",
          padding: "0.6rem",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}>
          Registrar
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
    </div>
  );
};

export default RegistroUsuario;
