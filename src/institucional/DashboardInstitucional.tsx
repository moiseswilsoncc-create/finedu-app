import React from "react";
import ValidacionPreVercel from "./ValidacionPreVercel";
import EditorEstadoArchivos from "./EditorEstadoArchivos";
import MetricaSupabase from "./MetricaSupabase";

const DashboardInstitucional: React.FC = () => {
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

export default DashboardInstitucional;
