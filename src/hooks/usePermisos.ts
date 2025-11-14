import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const usePermisos = () => {
  const [modulos, setModulos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
    const correoUsuario = localStorage.getItem("correoUsuario");
    if (!correoUsuario) {
      console.log("⚠️ No hay correo en localStorage → no se puede obtener permisos");
      setCargando(false);
      return;
    }

    // 1. Buscar uuid en tabla usuarios
    const obtenerUsuarioId = async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id")
        .eq("correo", correoUsuario)
        .single();

      if (error || !data) {
        console.error("❌ No se encontró usuario en Supabase:", error);
        setUsuarioId(null);
        setCargando(false);
        return;
      }

      console.log("🧠 UsuarioId obtenido:", data.id);
      setUsuarioId(data.id);
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
