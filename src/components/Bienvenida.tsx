import React from "react";
import { useNavigate } from "react-router-dom";

const Bienvenida: React.FC = () => {
  const navigate = useNavigate();
  console.log("✅ Bienvenida con navegación activada");

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
      <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
        Este portal fue creado para acompañarte en tu camino financiero. Aquí podrás acceder a herramientas educativas, simuladores, reportes y seguimiento institucional.
      </p>
      <p style={{ fontSize: "1.05rem", marginBottom: "2rem", color: "#555" }}>
        Finedu promueve el ahorro grupal, la autonomía financiera y el acceso gratuito a inteligencia económica. Cada usuario puede avanzar a su ritmo, acompañado por colaboradores e instituciones que fortalecen su progreso.
      </p>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem"
      }}>
        <button
          onClick={() => navigate("/registro-usuario")}
          style={{
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

        <button
          onClick={() => navigate("/login-usuario")}
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
          👤 Ingreso usuarios registrados
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
      </div>
    </div>
  );
};

export default Bienvenida;
