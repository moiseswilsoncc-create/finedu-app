import React from "react";
import InformeInstitucional from "./InformeInstitucional";

const DashboardInstitucional: React.FC = () => {
  const colaboradores = [
    { nombre: "Institución A", email: "contacto@institucionA.cl" },
    { nombre: "Institución B", email: "info@institucionB.cl" },
  ];

  const historialInformes = [
    { mes: "Julio", url: "/informes/Julio2025.pdf" },
    { mes: "Agosto", url: "/informes/Agosto2025.pdf" },
    { mes: "Septiembre", url: "/informes/Septiembre2025.pdf" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "#2c3e50" }}>🏛️ Dashboard Institucional Finedu</h1>
      <p style={{ fontSize: "1.1rem", color: "#555" }}>
        Panel central para visualizar métricas, informes y colaboradores registrados.
      </p>

      <section style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <div style={{ flex: 1, backgroundColor: "#ecf0f1", padding: "1rem", borderRadius: "8px" }}>
          <h3>👥 Usuarios activos</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#34495e" }}>1.245</p>
        </div>
        <div style={{ flex: 1, backgroundColor: "#ecf0f1", padding: "1rem", borderRadius: "8px" }}>
          <h3>💰 Ahorro total</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#27ae60" }}>$12.800.000 CLP</p>
        </div>
        <div style={{ flex: 1, backgroundColor: "#ecf0f1", padding: "1rem", borderRadius: "8px" }}>
          <h3>📈 Retención mensual</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2980b9" }}>87%</p>
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>📄 Informe mensual</h2>
        <InformeInstitucional />
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>📚 Historial de informes</h2>
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
        <h2>👥 Colaboradores registrados</h2>
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

export default DashboardInstitucional;
