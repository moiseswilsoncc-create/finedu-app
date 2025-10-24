import React from "react";
import { useNavigate } from "react-router-dom";

const VistaIngresoColaborador: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "12px",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#3498db" }}>👥 Acceso exclusivo para colaboradores</h2>
      <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
        Este portal es solo para colaboradores autorizados por Finedu.
      </p>
      <p style={{ marginTop: "1rem" }}>
        Si ya recibiste tu correo de activación con tu clave personal, puedes iniciar sesión.
      </p>
      <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
        Si aún no tienes acceso, primero debes enviar tu correo institucional a Finedu para recibir autorización.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔐 Iniciar sesión como colaborador
        </button>
      </div>
    </div>
  );
};

export default VistaIngresoColaborador;
