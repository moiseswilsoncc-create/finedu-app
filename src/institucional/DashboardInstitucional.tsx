import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type AhorroRegion = {
  region: string | null;
  pais: string | null;       // 👈 usar sin tilde para evitar errores
  monto_total: number | null;
  fecha: string | null;
};

const DashboardInstitucional: React.FC = () => {
  const [estado, setEstado] = useState("⏳ Cargando...");
  const [datos, setDatos] = useState<AhorroRegion[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data, error } = await supabase
          .from("ahorro_por_region")
          .select("region, pais, monto_total, fecha"); // 👈 columnas explícitas

        if (error) {
          console.error("❌ Error Supabase:", error.message);
          setEstado("❌ Error al obtener datos");
        } else if (!data || data.length === 0) {
          setEstado("⚠️ Sin datos disponibles");
        } else {
          setEstado("✅ Datos cargados correctamente");
          setDatos(data as AhorroRegion[]);
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err);
        setEstado("❌ Error inesperado");
      }
    };

    cargarDatos();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#333" }}>
      <h1>📊 Dashboard Institucional</h1>
      <p>{estado}</p>

      {datos.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Región</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>País</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Monto Total</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, index) => (
              <tr key={index}>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{fila.region || "—"}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{fila.pais || "—"}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {fila.monto_total !== null ? `$${fila.monto_total.toLocaleString("es-CL")}` : "—"}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {fila.fecha ? new Date(fila.fecha).toLocaleDateString("es-CL") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardInstitucional;
