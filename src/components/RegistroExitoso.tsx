// src/components/RegistroExitoso.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const RegistroExitoso: React.FC = () => {
  const navigate = useNavigate();

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
      <h2 style={{ color: "#27ae60" }}>🎉 Registro exitoso</h2>
      <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "#2c3e50" }}>
        Tu correo fue confirmado correctamente.  
        Ahora ya puedes ingresar con tu correo y clave.
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

export default RegistroExitoso;
