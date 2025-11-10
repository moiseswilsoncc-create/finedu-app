import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftsbnorudtcyrruubutt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk";

const supabase = createClient(supabaseUrl, supabaseKey);

interface Props {
  usuarioId: string;
}

const Permisos: React.FC<Props> = ({ usuarioId }) => {
  const [modulosPermitidos, setModulosPermitidos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        const { data, error } = await supabase
          .from("permisos_usuario")
          .select("modulo")
          .eq("usuario_id", usuarioId)
          .eq("permiso", "acceso");

        if (error) {
          console.error("❌ Error al consultar permisos:", error.message);
          setModulosPermitidos([]);
          return;
        }

        if (!Array.isArray(data)) {
          console.warn("⚠️ Respuesta inesperada de Supabase:", data);
          setModulosPermitidos([]);
          return;
        }

        const modulos = data.map((item) => item.modulo);
        setModulosPermitidos(modulos);
      } catch (err) {
        console.error("❌ Error inesperado al cargar permisos:", err);
        setModulosPermitidos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarPermisos();
  }, [usuarioId]);

  if (cargando) return <p>Cargando permisos...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h3>🔐 Módulos habilitados para este usuario</h3>
      {modulosPermitidos.length === 0 ? (
        <p style={{ color: "#999" }}>No tienes módulos habilitados.</p>
      ) : (
        <ul>
          {modulosPermitidos.map((modulo, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              ✅ {modulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Permisos;
