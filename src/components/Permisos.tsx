import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ⚠️ Usa variables de entorno en producción
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Props {
  usuarioId: string; // UUID del usuario logueado
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
