import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, useSearchParams } from "react-router-dom";

function NuevaClave() {
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");
  const correo = params.get("correo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nuevaClave.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaClave !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.post("/nueva-clave", {
        token,
        correo,
        nuevaClave,
      });

      if (response.data.success) {
        setMensaje("✅ Contraseña actualizada correctamente.");
        setError("");

        // Guardar sesión y redirigir según tipo de usuario
        localStorage.setItem("logueado", "true");
        localStorage.setItem("nombreUsuario", "Recuperado Finedu");

        if (correo?.includes("colaborador")) {
          localStorage.setItem("tipoUsuario", "colaborador");
          setTimeout(() => navigate("/panel-colaborador"), 2000);
        } else {
          localStorage.setItem("tipoUsuario", "usuario");
          setTimeout(() => navigate("/panel-usuario"), 2000);
        }
      } else {
        setError("❌ No se pudo actualizar la contraseña.");
        setMensaje("");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor.");
      setMensaje("");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "3rem auto",
      padding: "2rem",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🔒 Crear nueva contraseña</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaClave}
          onChange={(e) => setNuevaClave(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          required
        />

        {mensaje && <p style={{ color: "#2ecc71", fontSize: "0.95rem" }}>{mensaje}</p>}
        {error && <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>{error}</p>}

        <button type="submit" style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          Actualizar contraseña
        </button>
      </form>
    </div>
  );
}

export default NuevaClave;
