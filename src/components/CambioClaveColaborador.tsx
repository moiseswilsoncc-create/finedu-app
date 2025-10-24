import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CambioClaveColaborador: React.FC = () => {
  const [claveActual, setClaveActual] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const navigate = useNavigate();

  const handleCambio = (e: React.FormEvent) => {
    e.preventDefault();

    const claveGuardada = "clave-temporal"; // Simulación: clave que recibió por correo

    if (claveActual !== claveGuardada) {
      alert("La clave actual no es válida.");
      return;
    }

    if (nuevaClave.length < 6) {
      alert("La nueva clave debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaClave !== confirmacion) {
      alert("La confirmación no coincide con la nueva clave.");
      return;
    }

    // Simulación de cambio exitoso
    alert("✅ Clave actualizada correctamente.");
    navigate("/colaborador");
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "3rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "12px",
      backgroundColor: "#fefefe",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h2 style={{ color: "#e67e22" }}>🔒 Cambio de clave</h2>
      <p style={{ marginBottom: "1rem" }}>
        Por seguridad, cambia tu clave temporal por una personal.
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
          style={{ width: "100%", padding: "0.6rem", marginBottom: "1rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Guardar nueva clave
        </button>
      </form>
    </div>
  );
};

export default CambioClaveColaborador;
