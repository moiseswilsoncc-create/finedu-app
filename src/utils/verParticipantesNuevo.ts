import { supabase } from "../supabaseClient";

export async function verParticipantes(grupoId: string, usuarioId: string, correoIngresado?: string) {
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

    // 2. Consultar directamente la vista con nombres/apellidos
    const { data: participantes, error: errorVista } = await supabase
      .from("vista_participantes_con_usuarios")
      .select("*")
      .eq("grupo_id", grupoId)
      .eq("estado", "activo");

    if (errorVista) {
      return {
        mensaje: "❌ Error al obtener la lista de participantes desde la vista",
        error: true,
        data: [],
      };
    }

    // 3. Si se está agregando un invitado por correo, buscarlo en usuarios
    let invitadoExtra = null;
    if (correoIngresado) {
      const { data: usuario, error: errorUsuario } = await supabase
        .from("usuarios")
        .select("id, correo, nombre, apellido")
        .eq("correo", correoIngresado)
        .single();

      if (!errorUsuario && usuario) {
        invitadoExtra = usuario;
      }
    }

    // 4. Consolidar resultados
    const resultadoFinal = invitadoExtra
      ? [...(participantes || []), invitadoExtra]
      : participantes || [];

    console.log("🔍 Participantes consolidados:", resultadoFinal);

    return {
      mensaje: "✅ Participantes cargados correctamente",
      error: false,
      data: resultadoFinal,
    };
  } catch (err: any) {
    return {
      mensaje: err.message || "❌ Error inesperado al obtener participantes",
      error: true,
      data: [],
    };
  }
}
