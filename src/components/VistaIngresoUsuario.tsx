import React from "react";
import { Link } from "react-router-dom";

const VistaIngresoUsuario: React.FC = () => {
  const nombreUsuario = localStorage.getItem("nombreUsuario");

  return (
    <div style={{
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "12px",
      textAlign: "center",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ color: "#2ecc71" }}>🎉 ¡Registro exitoso, {nombreUsuario}!</h2>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        Bienvenido a <strong>Finedu</strong>, tu espacio de autonomía financiera.
      </p>
      <p style={{ marginTop: "1rem" }}>
        Desde hoy, formas parte de una comunidad que transforma metas en realidad.
      </p>
      <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
        Explora, simula, aprende y avanza. Estamos contigo en cada paso.
      </p>

      <Link to="/usuario">
        <button style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer"
        }}>
          Ir al panel de usuario
        </button>
      </Link>
    </div>
  );
};

export default VistaIngresoUsuario;
