import React from "react";
import GraficoLinea from "../components/Graficos/GraficoLinea";
import MapaCalor from "../components/Visualizaciones/MapaCalor";
import ExportadorPDF from "../components/Exportador/ExportadorPDF";

const InformeInstitucional: React.FC = () => {
  const secciones = [
    "Ahorro total",
    "Actividad de usuarios",
    "Simuladores utilizados",
    "Distribución geográfica",
    "Retención y crecimiento",
    "Análisis conversacional",
    "Estadísticas avanzadas"
  ];

  const datosGrafico = [
    { mes: "Mayo", ahorro: 1_200_000 },
    { mes: "Junio", ahorro: 1_800_000 },
    { mes: "Julio", ahorro: 2_400_000 },
    { mes: "Agosto", ahorro: 3_100_000 },
    { mes: "Septiembre", ahorro: 4_200_000 },
    { mes: "Octubre", ahorro: 5_200_000 },
  ];

  const datosGeograficos = [
    { region: "Metropolitana", ahorro: 6_200_000 },
    { region: "Valparaíso", ahorro: 1_800_000 },
    { region: "Biobío", ahorro: 1_500_000 },
    { region: "Otras regiones", ahorro: 2_500_000 },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", backgroundColor: "#fefefe", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h2 style={{ color: "#2c3e50" }}>📄 Informe Institucional – Octubre 2025</h2>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
        Este informe presenta las métricas clave de participación, ahorro y actividad dentro de la plataforma Finedu.
      </p>

      <GraficoLinea datos={datosGrafico} />

      <MapaCalor datos={datosGeograficos} />

      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ color: "#2c3e50" }}>📊 Tabla de resumen institucional</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#ecf0f1" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc", textAlign: "left" }}>Indicador</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc", textAlign: "left" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Usuarios activos</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>1.245</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Ahorro total (CLP)</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>$12.800.000</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Simuladores utilizados</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>3.412</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Retención mensual</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>87%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ExportadorPDF titulo="Informe Institucional Finedu" secciones={secciones} />
    </div>
  );
};

export default InformeInstitucional;
