import React from "react";
import InformeInstitucional from "./InformeInstitucional";

const PanelInstitucional: React.FC = () => {
  const historialInformes = [
    { mes: "Julio", url: "/informes/Julio2025.pdf" },
    { mes: "Agosto", url: "/informes/Agosto2025.pdf" },
    { mes: "Septiembre", url: "/informes/Septiembre2025.pdf" },
  ];

  const colaboradores = [
    { nombre: "Institución A", email: "contacto@institucionA.cl" },
    { nombre: "Institución B", email: "info@institucionB.cl" },
  ];

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "1000px",
      margin: "0 auto",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h1 style={{ color: "#2c3e50" }}>🏛️ Panel Institucional Finedu</h1>
      <p style={{ fontSize: "1.1rem", color: "#555" }}>
        Accede al informe mensual, historial de reportes y control de colaboradores institucionales.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ color: "#34495e" }}>📄 Informe actual</h2>
        <InformeInstitucional />
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2 style={{ color: "#34495e" }}>📚 Historial de informes</h2>
        <ul style={{ lineHeight: "1.8", fontSize: "1rem" }}>
          {historialInformes.map((informe) => (
            <li key={informe.mes}>
              <a href={informe.url} download style={{ color: "#2c3e50", textDecoration: "none" }}>
                📎 Descargar informe de {informe.mes}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2 style={{ color: "#34495e" }}>👥 Colaboradores registrados</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#ecf0f1" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc", textAlign: "left" }}>Nombre</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc", textAlign: "left" }}>Correo</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((colaborador) => (
              <tr key={colaborador.email}>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{colaborador.nombre}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{colaborador.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PanelInstitucional;
