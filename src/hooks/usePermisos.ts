// src/hooks/usePermisos.ts
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const usePermisos = (usuarioId: string | undefined) => {
  const [modulos, setModulos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioId) return; // ⛔ evita ejecución prematura

    const cargar = async () => {
      setCargando(true); // ✅ activa carga solo si hay ID

      try {
        const { data, error } = await supabase
          .from("permisos_usuario")
          .select("modulo")
          .eq("usuario_id", usuarioId)
          .eq("permiso", "acceso");
        if (error) {
          console.error("❌ Error al consultar permisos:", error.message);
          setModulos([]);
        } else if (!Array.isArray(data)) {
          console.warn("⚠️ Respuesta inesperada de Supabase:", data);
          setModulos([]);
        } else {
          const modulos = data.map((d) => d.modulo).filter(Boolean);
          setModulos(modulos);
        }
      } catch (err) {
        console.error("❌ Error inesperado al cargar permisos:", err);
        setModulos([]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [usuarioId]);

  return { modulos, cargando };
};
