import React from "react";

type Props = {
  titulo: string;
  fecha: string;
  resumen: string;
  children: React.ReactNode;
};

const LayoutInformeInstitucional: React.FC<Props> = ({ titulo, fecha, resumen, children }) => {
  return (
    <div style={{
      padding: "3rem",
      maxWidth: "1000px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      color: "#2c3e50"
    }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="/logo-finedu.png" alt="Logo Finedu" style={{ height: "60px", marginBottom: "1rem" }} />
        <h1>{titulo}</h1>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>{fecha}</p>
        <p style={{ fontSize: "1rem", marginTop: "1rem" }}>{resumen}</p>
      </header>

      <main>{children}</main>

      <footer style={{ marginTop: "3rem", textAlign: "center", fontSize: "0.9rem", color: "#888" }}>
        <p>© 2025 Finedu LATAM — Informe institucional generado automáticamente</p>
      </footer>
    </div>
  );
};

export default LayoutInformeInstitucional;
