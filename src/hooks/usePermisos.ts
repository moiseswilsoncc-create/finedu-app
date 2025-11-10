import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const usePermisos = (usuarioId: string | null) => {
  const [modulos, setModulos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioId) {
      console.warn("⚠️ usuarioId es null, no se puede consultar permisos");
      setModulos([]);
      setCargando(false);
      return;
    }

    const cargar = async () => {
      try {
        const { data, error } = await supabase
          .from("permisos_usuario")
          .select("modulo")
          .eq("usuario_id", usuarioId) // ✅ campo correcto
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
