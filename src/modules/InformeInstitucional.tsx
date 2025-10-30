import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import MapaCalor from "../components/Visualizaciones/MapaCalor";
import ExportadorPDF from "../components/Exportador/ExportadorPDF";

const supabase = createClient(
  "https://ftsbnorudtcyrrubutt.supabase.co",
  process.env.SUPABASE_KEY || "TU_API_KEY"
);

const InformeInstitucional: React.FC = () => {
  const [datosGeograficos, setDatosGeograficos] = useState<any[]>([]);
  const [resumen, setResumen] = useState<any[]>([]);

  const secciones = [
    "Ahorro total",
    "Actividad de usuarios",
    "Simuladores utilizados",
    "Distribución geográfica",
    "Retención y crecimiento",
    "Análisis conversacional",
    "Estadísticas avanzadas"
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: ahorroPorRegion } = await supabase
        .from("ahorro_por_region")
        .select("region, monto");

      const { data: resumenInstitucional } = await supabase
        .from("panel_institucional")
        .select("indicador, valor");

      setDatosGeograficos(ahorroPorRegion || []);
      setResumen(resumenInstitucional || []);
    };

    cargarDatos();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", backgroundColor: "#fefefe", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h2 style={{ color: "#2c3e50" }}>📄 Informe Institucional – Octubre 2025</h2>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
        Este informe presenta las métricas clave de participación, ahorro y actividad dentro de la plataforma Finedu.
      </p>

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
            {resumen.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{item.indicador}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{item.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExportadorPDF titulo="Informe Institucional Finedu" secciones={secciones} />
    </div>
  );
};

export default InformeInstitucional;
