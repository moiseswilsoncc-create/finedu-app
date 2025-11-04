import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const EditarPerfilUsuario: React.FC = () => {
  const correoGuardado = localStorage.getItem("correoUsuario");
  const [nombre, setNombre] = useState("");
  const [clave, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    if (!correoGuardado) return;

    const obtenerDatos = async () => {
      try {
        const { data, error } = await supabase
          .from("usuarios")
          .select("nombre, clave")
          .eq("correo", correoGuardado)
          .single();

        if (error) {
          console.error("Error al obtener datos:", error);
          setError("No se pudo cargar el perfil.");
          return;
        }

        if (data) {
          setNombre(data.nombre);
          setContraseña(data.clave);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        setError("No se pudo cargar el perfil.");
      }
    };

    obtenerDatos();
  }, [correoGuardado]);

  const guardarCambios = async () => {
    if (!correoGuardado) return;

    try {
      const { data, error } = await supabase
        .from("usuarios")
        .update({ nombre, clave })
        .eq("correo", correoGuardado)
        .select();

      if (error) {
        console.error("Error al guardar cambios:", error);
        setError("No se pudo guardar el perfil.");
        setExito("");
        return;
      }

      console.log("Perfil actualizado:", data);
      setExito("✅ Cambios guardados correctamente.");
      setError("");
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Hubo un problema al conectar con el servidor.");
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
        value={clave}
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
