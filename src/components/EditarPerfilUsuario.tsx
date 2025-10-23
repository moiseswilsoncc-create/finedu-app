import React, { useState, useEffect } from "react";

const EditarPerfilUsuario: React.FC = () => {
  const correoGuardado = localStorage.getItem("correoUsuario");
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    if (!correoGuardado) return;

    const obtenerDatos = async () => {
      try {
        const response = await fetch(`https://ftsbnorudtcyrrubutt.supabase.co/rest/v1/usuarios?correo=eq.${correoGuardado}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk"
          }
        });

        const data = await response.json();
        if (data.length > 0) {
          setNombre(data[0].nombre);
          setContraseña(data[0].contraseña);
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError("No se pudo cargar el perfil.");
      }
    };

    obtenerDatos();
  }, [correoGuardado]);

  const guardarCambios = async () => {
    if (!correoGuardado) return;

    try {
      const response = await fetch(`https://ftsbnorudtcyrrubutt.supabase.co/rest/v1/usuarios?correo=eq.${correoGuardado}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          nombre,
          contraseña
        })
      });

      const data = await response.json();
      console.log("Perfil actualizado:", data);
      setExito("Cambios guardados correctamente.");
      setError("");
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      setError("No se pudo guardar el perfil.");
      setExito("");
    }
  };

  if (!correoGuardado) {
    return (
      <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem", textAlign: "center" }}>
        <h2>Acceso denegado</h2>
        <p>No se encontró un correo registrado. Por favor inicia sesión o regístrate antes de editar tu perfil.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Editar Perfil</h2>

      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <label>Contraseña:</label>
      <input
        type="password"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <button onClick={guardarCambios} style={{ width: "100%", padding: "0.5rem", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px" }}>
        Guardar cambios
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      {exito && <p style={{ color: "green", marginTop: "1rem" }}>{exito}</p>}
    </div>
  );
};

export default EditarPerfilUsuario;
