import React from "react";

const Bienvenida: React.FC = () => {
  console.log("✅ Bienvenida con textos activada");

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
    </div>
  );
};

export default Bienvenida;
