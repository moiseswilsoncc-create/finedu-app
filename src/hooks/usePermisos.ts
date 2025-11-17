import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const usePermisos = () => {
  const [modulos, setModulos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
    const obtenerUsuarioId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("❌ No se pudo obtener usuario de Supabase:", error);
        setUsuarioId(null);
        setCargando(false);
        return;
      }

      console.log("🧠 UsuarioId obtenido:", user.id);
      setUsuarioId(user.id);
    };

    obtenerUsuarioId();
  }, []);

  useEffect(() => {
    if (!usuarioId) {
      console.log("⏳ usePermisos: esperando usuarioId...");
      return;
    }

    console.log("🧩 usePermisos: usuarioId recibido:", usuarioId);
    setCargando(true);

    const cargar = async () => {
      try {
        const { data, error } = await supabase
          .from("permisos_usuario")
          .select("modulo")
          .eq("usuario_id", usuarioId)
          .eq("permiso", "acceso");

        if (error) {
          console.error("❌ Error al consultar permisos:", error.message);
          setModulos([]);
        } else {
          const modulosPermitidos = (data ?? []).map((d) => d.modulo).filter(Boolean);
          console.log("🔍 Módulos permitidos:", modulosPermitidos);
          setModulos(modulosPermitidos);
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

  return { modulos, cargando, usuarioId };
};
