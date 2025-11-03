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
        Más que una aplicación de finanzas, <strong>Finedu es tu asesor financiero personal</strong>. 
        Aquí encontrarás claridad, control y acompañamiento para tomar mejores decisiones económicas.
      </p>
      <p style={{ fontSize: "1.05rem", marginBottom: "2rem", color: "#555" }}>
        Finedu promueve el ahorro grupal, la autonomía financiera y el acceso gratuito a inteligencia económica. 
        Cada usuario puede avanzar a su ritmo, acompañado por colaboradores e instituciones que fortalecen su progreso.
      </p>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem"
      }}>
        {/* 🔀 Botones para usuarios */}
        <button
          onClick={() => navigate("/registro-usuario")}
          style={buttonStyle("#e74c3c")}
        >
          🚀 ¡No pierdas esta oportunidad! Registrarte Ahora
        </button>

        <button
          onClick={() => navigate("/login-usuario")}
          style={buttonStyle("#3498db")}
        >
          👤 Ingreso usuarios registrados
        </button>

        {/* 🔀 Botones para colaboradores */}
        <button
          onClick={() => navigate("/registro-colaborador")}
          style={buttonStyle("#2ecc71")}
        >
          🆕 Primera vez como colaborador
        </button>

        <button
          onClick={() => navigate("/ingreso-colaborador")}
          style={buttonStyle("#16a085")}
        >
          🔐 Ya tengo cuenta de colaborador
        </button>
      </div>
    </div>
  );
};

// 🎨 Reutilizamos estilos para simplificar
const buttonStyle = (bgColor: string) => ({
  padding: "0.8rem 1.5rem",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
  width: "100%",
  maxWidth: "300px"
});

export default Bienvenida;
