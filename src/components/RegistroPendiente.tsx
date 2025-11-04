// src/components/RegistroPendiente.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RegistroPendiente: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { mensaje?: string };
  const mensaje = state?.mensaje || "✅ Tu cuenta fue creada. Revisa tu correo y confirma antes de iniciar sesión.";

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#fefefe",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}
    >
      <h2 style={{ color: "#27ae60" }}>Registro pendiente</h2>
      <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "#2c3e50" }}>
        {mensaje}
      </p>
      <p style={{ marginTop: "1rem", color: "#7f8c8d" }}>
        Si no encuentras el correo, revisa tu carpeta de spam o promociones.
      </p>
      <button
        onClick={() => navigate("/login-usuario")}
        style={{
          marginTop: "2rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Ir al login
      </button>
    </div>
  );
};

export default RegistroPendiente;
