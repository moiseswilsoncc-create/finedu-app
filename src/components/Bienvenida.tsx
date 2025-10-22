import React from "react";
import "./Bienvenida.css"; // Opcional si quieres estilos específicos

const Bienvenida = () => {
  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "40px" }}>
      <img src="/logo.png" alt="Finedu Logo" className="logo" />
      <h1 style={{ color: "var(--color-primario)", fontSize: "2.5rem", marginBottom: "10px" }}>
        Bienvenido a Finedu
      </h1>
      <p style={{ color: "var(--color-texto)", fontSize: "1.2rem" }}>
        Tu guía hacia la libertad financiera en LATAM
      </p>
      <button className="btn-primario" style={{ marginTop: "30px" }}>
        Comenzar
      </button>
    </div>
  );
};

export default Bienvenida;
