import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

interface Archivo {
  id: string;
  nombre: string;
  validado: boolean;
  conectado_supabase: boolean;
  mejoras_integradas: boolean;
  listo_vercel: boolean;
}

const ValidacionPreVercel: React.FC = () => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);

  useEffect(() => {
    const cargarArchivos = async () => {
      const { data, error } = await supabase
        .from("estado_archivos")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("❌ Error al cargar estado de archivos:", error.message);
      } else {
        setArchivos(data || []);
      }
    };

    cargarArchivos();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>✅ Validación final antes de subir a Vercel</h2>

      {archivos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#7f8c8d" }}>No hay archivos registrados para validación.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#ecf0f1" }}>
              <th style={thStyle}>Archivo</th>
              <th style={thStyle}>Validado</th>
              <th style={thStyle}>Supabase</th>
              <th style={thStyle}>Mejoras</th>
              <th style={thStyle}>Listo Vercel</th>
            </tr>
          </thead>
          <tbody>
            {archivos.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={tdStyle}>{a.nombre}</td>
                <td style={tdStyle}>{a.validado ? "✅" : "❌"}</td>
                <td style={tdStyle}>{a.conectado_supabase ? "🟢" : "⚪"}</td>
                <td style={tdStyle}>{a.mejoras_integradas ? "🧠" : "⏳"}</td>
                <td style={tdStyle}>{a.listo_vercel ? "🚀" : "🔧"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  padding: "0.8rem",
  textAlign: "left" as const,
  borderBottom: "2px solid #bdc3c7"
};

const tdStyle = {
  padding: "0.6rem"
};

export default ValidacionPreVercel;
