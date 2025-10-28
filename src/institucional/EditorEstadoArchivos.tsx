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

const EditorEstadoArchivos: React.FC = () => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarArchivos = async () => {
      const { data, error } = await supabase
        .from("estado_archivos")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("❌ Error al cargar archivos:", error.message);
      } else {
        setArchivos(data || []);
      }
    };

    cargarArchivos();
  }, []);

  const actualizarCampo = async (id: string, campo: keyof Archivo, valor: boolean) => {
    const { error } = await supabase
      .from("estado_archivos")
      .update({ [campo]: valor, fecha_actualizacion: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      setMensaje("❌ Error al actualizar estado.");
      console.error(error);
    } else {
      setMensaje("✅ Estado actualizado correctamente.");
      setArchivos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [campo]: valor } : a))
      );
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🛠️ Editor de estado de archivos</h2>
      {mensaje && (
        <p style={{ textAlign: "center", color: mensaje.includes("✅") ? "green" : "red" }}>
          {mensaje}
        </p>
      )}
      {archivos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#7f8c8d" }}>No hay archivos registrados.</p>
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
                {["validado", "conectado_supabase", "mejoras_integradas", "listo_vercel"].map((campo) => (
                  <td key={campo} style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={a[campo as keyof Archivo]}
                      onChange={(e) =>
                        actualizarCampo(a.id, campo as keyof Archivo, e.target.checked)
                      }
                    />
                  </td>
                ))}
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
  padding: "0.6rem",
  textAlign: "center" as const
};

export default EditorEstadoArchivos;
