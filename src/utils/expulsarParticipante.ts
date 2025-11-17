import { supabase } from "../supabaseClient";

// ✅ Función institucional para expulsar participante y sincronizar contexto
export async function expulsarParticipante(
  grupoId: string,
  participanteId: string,
  actualizarEstadoLocal?: (correo: string) => void // 👈 callback opcional para sincronizar frontend
) {
  try {
    // 1️⃣ Validar sesión activa
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        mensaje: "❌ No hay sesión activa. Debes iniciar sesión para expulsar participantes.",
        error: true,
      };
    }

    // 2️⃣ Validar que quien llama sea el admin del grupo
    const { data: grupo, error: errorGrupo } = await supabase
      .from("grupos_ahorro")
      .select("administrador_id")
      .eq("id", grupoId)
      .single();

    if (errorGrupo) {
      return { mensaje: "❌ Error al validar grupo", error: true };
    }
    if (grupo?.administrador_id !== user.id) {
      return {
        mensaje: "🔒 No tienes permiso para expulsar participantes de este grupo",
        error: true,
      };
    }

    // 3️⃣ Verificar que el usuario a expulsar sea miembro activo del grupo
    const { data: participante, error: errorParticipante } = await supabase
      .from("participantes_grupo")
      .select("id, usuario_id")
      .eq("grupo_id", grupoId)
      .eq("usuario_id", participanteId)
      .eq("estado", "activo")
      .single();

    if (errorParticipante || !participante) {
      return {
        mensaje: "⚠️ El participante no está activo en este grupo",
        error: true,
      };
    }

    // 4️⃣ Obtener datos del usuario (nombre + apellido + correo)
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("nombre, apellido, correo")
      .eq("id", participante.usuario_id)
      .single();

    if (errorUsuario || !usuario) {
      return {
        mensaje: "❌ No se pudo obtener datos del usuario expulsado",
        error: true,
      };
    }

    // 5️⃣ Actualizar estado a 'expulsado'
    const { error: errorUpdate } = await supabase
      .from("participantes_grupo")
      .update({ estado: "expulsado" })
      .eq("id", participante.id);

    if (errorUpdate) {
      return { mensaje: "❌ Error al expulsar participante", error: true };
    }

    // 6️⃣ Registrar evento en historial con identidad completa
    await supabase.from("historial_grupo").insert({
      grupo_id: grupoId,
      usuario_id: user.id,
      tipo_evento: "expulsión",
      detalle: `Se expulsó a ${usuario.nombre} ${usuario.apellido} (${usuario.correo}) del grupo.`,
    });

    // 7️⃣ Sincronizar estado local si se pasó callback
    if (actualizarEstadoLocal) {
      actualizarEstadoLocal(usuario.correo); // 👈 elimina del estado local por correo
    }

    return { mensaje: "✅ Participante expulsado exitosamente.", error: false };
  } catch (err: any) {
    return {
      mensaje: err.message || "❌ Error inesperado al expulsar participante",
      error: true,
    };
  }
}
