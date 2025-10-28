import React, { useState } from "react";
import ValidacionPreVercel from "./ValidacionPreVercel";
import EditorEstadoArchivos from "./EditorEstadoArchivos";
import MetricaSupabase from "./MetricaSupabase";

const DashboardInstitucional: React.FC = () => {
  const [mensaje, setMensaje] = useState("");

  const limpiarTokens = async () => {
    try {
      const res = await fetch("https://TU_BACKEND_URL/limpiar-tokens-vencidos", {
        method: "POST"
      });
      const data = await res.json();
      setMensaje(data.mensaje || "✅ Limpieza ejecutada.");
    } catch (error) {
      console.error("❌ Error al limpiar tokens:", error);
      setMensaje("❌ Error al ejecutar limpieza.");
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <img src="/logo-finedu.png" alt="Logo Finedu" style={{ height: "50px" }} />
        <h1 style={{ marginLeft: "1rem", color: "#2c3e50" }}>🏛️ Dashboard Institucional</h1>
      </header>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>✅ Validación final antes de subir a Vercel</h2>
        <ValidacionPreVercel />
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>🛠️ Editor de estado de archivos</h2>
        <EditorEstadoArchivos />
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>📊 Métricas Supabase</h2>
        <MetricaSupabase />
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>🧹 Limpieza de tokens vencidos</h2>
        <button onClick={limpiarTokens} style={buttonStyle}>Ejecutar limpieza ahora</button>
        {mensaje && (
          <p style={{ marginTop: "1rem", color: mensaje.includes("✅") ? "green" : "red" }}>
            {mensaje}
          </p>
        )}
      </section>
    </div>
  );
};

const containerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "12px"
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "2rem"
};

const sectionStyle = {
  marginBottom: "3rem"
};

const titleStyle = {
  color: "#34495e",
  marginBottom: "1rem"
};

const buttonStyle = {
  padding: "0.8rem",
  backgroundColor: "#e67e22",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer"
};

export default DashboardInstitucional;
