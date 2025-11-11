import { supabase } from "../supabaseClient";

export async function agregarParticipante(
  grupoId: number | string,
  correo: string,
  adminId: string
) {
  try {
    // Normalizamos el correo
    const correoNormalizado = correo.trim().toLowerCase();

    // Validamos si el correo existe en la tabla usuarios
    const { data, error } = await supabase
      .from("usuarios")
      .select("correo")
      .eq("correo", correoNormalizado);

    if (error) {
      return { mensaje: "❌ Error al validar usuario", error: true };
    }

    if (!data || data.length === 0) {
      return { mensaje: "⚠️ El correo ingresado no está registrado en Finedu", error: true };
    }

    // Insertamos participante en la tabla participantes_grupo
    const { error: insertError } = await supabase
      .from("participantes_grupo")
      .insert([
        {
          grupo_id: grupoId,
          correo: correoNormalizado,
          agregado_por: adminId,
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
