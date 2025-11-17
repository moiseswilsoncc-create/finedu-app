import { supabase } from "../supabaseClient";

export async function verParticipantes(grupoId: string, usuarioId: string) {
  try {
    // 1. Validar que el usuario pertenece al grupo
    const { data: vinculo, error: errorVinculo } = await supabase
      .from("participantes_grupo")
      .select("id")
      .eq("grupo_id", grupoId)
      .eq("usuario_id", usuarioId)
      .eq("estado", "activo")
      .single();

    if (errorVinculo || !vinculo) {
      return {
        mensaje: "🔒 No tienes acceso a los participantes de este grupo",
        error: true,
        data: [],
      };
    }

    // 2. Obtener todos los participantes activos del grupo
    const { data: participantes, error: errorLista } = await supabase
      .from("participantes_grupo")
      .select("id, usuario_id, rol, fecha_ingreso, estado, correo")
      .eq("grupo_id", grupoId)
      .eq("estado", "activo");

    if (errorLista || !participantes) {
      return {
        mensaje: "❌ Error al obtener la lista de participantes",
        error: true,
        data: [],
      };
    }

    // 3. Traer los usuarios vinculados
    const usuariosIds = participantes.map((p) => p.usuario_id);

    const { data: usuarios, error: errorUsuarios } = await supabase
      .from("usuarios")
      .select("id, nombre, apellido, correo")
      .in("id", usuariosIds);

    if (errorUsuarios || !usuarios) {
      return {
        mensaje: "❌ Error al obtener datos de usuarios",
        error: true,
        data: [],
      };
    }

    // 4. Merge manual: unir participantes con sus usuarios
    const participantesConNombre = participantes.map((p) => ({
      ...p,
      usuario: usuarios.find((u) => u.id === p.usuario_id),
    }));

    console.log("🔍 Participantes con merge manual:", participantesConNombre);

    return {
      mensaje: "✅ Participantes cargados correctamente",
      error: false,
      data: participantesConNombre,
    };
  } catch (err: any) {
    return {
      mensaje: err.message || "❌ Error inesperado al obtener participantes",
      error: true,
      data: [],
    };
  }
}
