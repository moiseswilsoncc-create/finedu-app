// src/hooks/usePermisos.ts
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const usePermisos = (usuarioId: string | null) => {
  const [modulos, setModulos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioId) return;

    const cargar = async () => {
      const { data, error } = await supabase
        .from("permisos_usuario")
        .select("modulo")
        .eq("usuario_id", usuarioId)
        .eq("permiso", "acceso");

      if (error || !Array.isArray(data)) {
        console.error("Error al cargar permisos:", error?.message || data);
        setModulos([]);
      } else {
        setModulos(data.map((d) => d.modulo));
      }

      setCargando(false);
    };

    cargar();
  }, [usuarioId]);

  return { modulos, cargando };
};
