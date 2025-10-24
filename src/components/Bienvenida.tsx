import React from "react";
import { useNavigate } from "react-router-dom";

const Bienvenida: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: "700px",
      margin: "3rem auto",
      padding: "2rem",
      textAlign: "center",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "1rem" }}>👋 Bienvenido a Finedu</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
        Este portal te permite acceder a herramientas financieras, simuladores, reportes y acompañamiento institucional.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={() => navigate("/ingreso-usuario")}
          style={{
            padding: "0.8rem 1.5rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
            maxWidth: "300px"
          }}
        >
          👤 Ingresar como usuario registrado
        </button>

        <button
          onClick={() => navigate("/ingreso-colaborador")}
          style={{
            padding: "0.8rem 1.5rem",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
            maxWidth: "300px"
          }}
        >
          👥 Ingreso colaboradores
        </button>

        {/* ✅ Botón corregido para registro de nuevos usuarios */}
        <button
          onClick={() => navigate("/registro-usuario")}
          style={{
            marginTop: "2rem",
            padding: "0.8rem 1.5rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
            maxWidth: "300px"
          }}
        >
          🚀 ¡No pierdas esta oportunidad! Registrarte Ahora
        </button>
      </div>
    </div>
  );
};

export default Bienvenida;
