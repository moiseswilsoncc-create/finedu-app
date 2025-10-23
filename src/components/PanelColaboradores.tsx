import React from "react";
import ExportadorPDF from "../components/Exportador/ExportadorPDF";

function PanelColaboradores() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>📊 Panel de Colaboradores</h2>
      <p>Aquí se mostrará la información de los participantes y el acceso al informe institucional mensual.</p>

      {/* Botón para descargar el informe institucional */}
      <ExportadorPDF
        titulo="Informe Institucional Finedu"
        secciones={[
          "Ahorro total",
          "Actividad de usuarios",
          "Simuladores utilizados",
          "Distribución geográfica",
          "Retención y crecimiento",
          "Análisis conversacional",
          "Estadísticas avanzadas"
        ]}
      />
    </div>
  );
}

export default PanelColaboradores;
