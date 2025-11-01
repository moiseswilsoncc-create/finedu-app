import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CambioClaveColaborador: React.FC = () => {
  const [claveActual, setClaveActual] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const correo = localStorage.getItem("correoColaborador");

  const handleCambio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!correo) {
      setError("No se encontró el correo en la sesión.");
      return;
    }

    if (nuevaClave.length < 6) {
      setError("⚠️ La nueva clave debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaClave !== confirmacion) {
      setError("⚠️ La confirmación no coincide con la nueva clave.");
      return;
    }

    try {
      // 1. Validar clave actual
      const { data: colaborador, error: errorBusqueda } = await supabase
        .from("colaboradores")
        .select("id, clave")
        .eq("correo", correo)
        .single();

      if (errorBusqueda || !colaborador) {
        setError("❌ No se encontró el colaborador.");
        return;
      }

      if (colaborador.clave !== claveActual) {
        setError("❌ La clave actual no es válida.");
        return;
      }

      // 2. Actualizar clave
      const { error: errorUpdate } = await supabase
        .from("colaboradores")
        .update({ clave: nuevaClave })
        .eq("correo", correo);

      if (errorUpdate) {
        setError("❌ No se pudo actualizar la clave.");
        return;
      }

      alert("✅ Clave actualizada correctamente.");
      navigate("/panel-colaboradores");
    } catch (err) {
      console.error("Error al cambiar la clave:", err);
      setError("❌ Error de conexión. Intenta nuevamente.");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "3rem auto",
      padding: "2rem",
      border: "1px solid #ddd",
      borderRadius: "12px",
      backgroundColor: "#fefefe",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h2 style={{ color: "#e67e22", marginBottom: "1rem" }}>🔒 Cambio de clave</h2>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Por seguridad, cambia tu clave temporal por una personal. Esto refuerza tu acceso institucional.
      </p>
      <form onSubmit={handleCambio}>
        <input
          type="password"
          placeholder="Clave actual"
          value={claveActual}
          onChange={(e) => setClaveActual(e.target.value)}
          required
          style={{ width: "100%", padding: "0.6rem", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Nueva clave"
          value={nuevaClave}
          onChange={(e) => setNuevaClave(e.target.value)}
          required
          style={{ width: "100%", padding: "0.6rem", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Confirmar nueva clave"
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          required
          style={{ width: "100%", padding: "0.6rem", marginBottom: "1.5rem" }}
        />
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Guardar nueva clave
        </button>
      </form>
    </div>
  );
};

export default CambioClaveColaborador;
