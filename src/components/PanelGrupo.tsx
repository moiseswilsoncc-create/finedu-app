import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Grupo } from "../types";

const supabaseUrl = "https://ftsbnorudtcyrrubutt.supabase.co";
const supabaseKey = "TU_API_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const PanelGrupo: React.FC = () => {
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [error, setError] = useState("");

  const grupoId = localStorage.getItem("grupoId");

  useEffect(() => {
    const cargarGrupo = async () => {
      if (!grupoId) {
        setError("No se encontró el grupo asociado a tu sesión.");
        return;
      }

      const { data, error: errorGrupo } = await supabase
        .from("grupos")
        .select("*")
        .eq("id", grupoId)
        .single();

      if (errorGrupo || !data) {
        setError("No se pudo cargar la información del grupo.");
        return;
      }

      setGrupo(data);
    };

    cargarGrupo();
  }, [grupoId]);

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#c0392b" }}>⚠️ Error</h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>{error}</p>
      </div>
    );
  }

  if (!grupo) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#2980b9" }}>⏳ Cargando grupo...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        🧭 Panel del grupo: {grupo.nombre}
      </h2>

      <div style={{
        backgroundColor: "#ecf0f1",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "2rem"
      }}>
        <p><strong>Ciudad:</strong> {grupo.ciudad}</p>
        <p><strong>Comuna:</strong> {grupo.comuna}</p>
        <p><strong>País:</strong> {grupo.pais}</p>
        <p><strong>Meta grupal:</strong> ${grupo.meta_grupal.toLocaleString("es-CL")}</p>
        <p><strong>Fecha de creación:</strong> {new Date(grupo.fecha_creacion).toLocaleDateString("es-CL")}</p>
        <p><strong>Estado:</strong> {grupo.activo ? "✅ Activo" : "⛔️ Inactivo"}</p>
      </div>

      <p style={{ fontSize: "0.95rem", color: "#888" }}>
        Este panel muestra la información institucional del grupo al que perteneces.
      </p>
    </div>
  );
};

export default PanelGrupo;
