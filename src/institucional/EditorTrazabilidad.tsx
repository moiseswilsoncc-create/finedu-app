import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const EditorTrazabilidad: React.FC = () => {
  const [archivos, setArchivos] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const { data } = await supabase.from("trazabilidad_archivos").select("*");
      setArchivos(data || []);
    };
    cargarDatos();
  }, []);

  const actualizarArchivo = async (index: number) => {
    const archivo = archivos[index];
    const { error } = await supabase
      .from("trazabilidad_archivos")
      .update({
        descripcion: archivo.descripcion,
        estado: archivo.estado,
        mejoras_integradas: archivo.mejoras_integradas,
        conectado_supabase: archivo.conectado_supabase,
        fecha_revision: new Date().toISOString()
      })
      .eq("id", archivo.id);

    if (error) {
      setMensaje("❌ Error al actualizar.");
    } else {
      setMensaje("✅ Archivo actualizado correctamente.");
    }
  };

  const handleChange = (index: number, campo: string, valor: any) => {
    const copia = [...archivos];
    copia[index][campo] = valor;
    setArchivos(copia);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>🛠️ Editor de trazabilidad institucional</h2>
      {mensaje && <p style={{ color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</p>}
      {archivos.map((a, index) => (
        <div key={a.id} style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem"
        }}>
          <strong>{a.archivo}</strong>
          <textarea
            value={a.descripcion}
            onChange={(e) => handleChange(index, "descripcion", e.target.value)}
            placeholder="Descripción del archivo"
            style={{ width: "100%", marginTop: "0.5rem", height: "60px" }}
          />
          <select
            value={a.estado}
            onChange={(e) => handleChange(index, "estado", e.target.value)}
            style={{ marginTop: "0.5rem" }}
          >
            <option value="actualizado">✅ Actualizado</option>
            <option value="pendiente">🕒 Pendiente</option>
            <option value="en revisión">🔍 En revisión</option>
          </select>
          <div style={{ marginTop: "0.5rem" }}>
            <label>
              <input
                type="checkbox"
                checked={a.mejoras_integradas}
                onChange={(e) => handleChange(index, "mejoras_integradas", e.target.checked)}
              /> Mejoras integradas
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="checkbox"
                checked={a.conectado_supabase}
                onChange={(e) => handleChange(index, "conectado_supabase", e.target.checked)}
              /> Conectado a Supabase
            </label>
          </div>
          <button
            onClick={() => actualizarArchivo(index)}
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            💾 Guardar cambios
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditorTrazabilidad;
