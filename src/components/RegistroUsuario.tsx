import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegistroUsuario: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
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
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk"
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
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          correo,
          contraseña,
          nombre,
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

        navigate("/felicitacion"); // ✅ Redirección mejorada
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
      maxWidth: "400px",
      margin: "2rem auto",
      padding: "1rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Correo:</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <button type="submit" style={{
          width: "100%",
          padding: "0.5rem",
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
