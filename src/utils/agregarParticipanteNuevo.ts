import { supabase } from "../supabaseClient";

export async function agregarParticipante(
  grupoId: number | string,
  correo: string,
  adminId: string
) {
  try {
    // Normalizamos el correo
    const correoNormalizado = correo.trim().toLowerCase();

    // Buscar usuario por correo y obtener su ID
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("id, correo")
      .eq("correo", correoNormalizado)
      .single();

    if (error) {
      return { mensaje: "❌ Error al validar usuario", error: true };
    }

    if (!usuario) {
      return { mensaje: "⚠️ El correo ingresado no está registrado en Finedu", error: true };
    }

    // Insertar participante usando usuario_id y correo como auxiliar
    const { error: insertError } = await supabase
      .from("participantes_grupo")
      .insert([
        {
          grupo_id: grupoId,
          usuario_id: usuario.id,     // 👈 vínculo oficial
          correo: usuario.correo,     // 👈 auxiliar para trazabilidad
          invitado_por: adminId,      // 👈 usa invitado_por en vez de agregado_por
          estado: "activo",
          fecha_ingreso: new Date(),  // opcional: registrar fecha
        },
      ]);

    if (insertError) {
      return { mensaje: "❌ Error al agregar participante", error: true };
    }

    return { mensaje: "✅ Participante agregado correctamente", error: false };
  } catch (err: any) {
    return { mensaje: err.message || "❌ Error inesperado al agregar participante", error: true };
  }
}
