import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistroUsuario: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
      console.log("Usuario guardado:", data);
      navigate("/vista-ingreso-usuario");
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setError("No se pudo registrar el usuario.");
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Correo:</label>
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />

        <label>Contraseña:</label>
        <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />

        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <button type="submit">Registrar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegistroUsuario;
