import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";


const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

interface Colaborador {
  id: string;
  nombre: string;
  correo: string;
  pais: string;
  rol: string;
  fecha_ingreso: string;
  activo: boolean;
}

const PanelColaboradores: React.FC = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);

  useEffect(() => {
    const cargarColaboradores = async () => {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .order("fecha_ingreso", { ascending: false });

      if (error) {
        console.error("❌ Error al cargar colaboradores:", error.message);
      } else {
        setColaboradores(data || []);
      }
    };

    cargarColaboradores();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🧑‍💼 Colaboradores registrados</h2>

      {colaboradores.length === 0 ? (
        <p style={{ textAlign: "center", color: "#7f8c8d" }}>No hay colaboradores registrados.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#ecf0f1" }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>País</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Ingreso</th>
              <th style={thStyle}>Activo</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((colab) => (
              <tr key={colab.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={tdStyle}>{colab.nombre}</td>
                <td style={tdStyle}>{colab.correo}</td>
                <td style={tdStyle}>{colab.pais}</td>
                <td style={tdStyle}>{colab.rol}</td>
                <td style={tdStyle}>{colab.fecha_ingreso}</td>
                <td style={tdStyle}>{colab.activo ? "✅" : "❌"}</td>
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

export default PanelColaboradores;
