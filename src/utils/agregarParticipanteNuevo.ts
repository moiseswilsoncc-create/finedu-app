import { supabase } from "../supabaseClient";

export async function agregarParticipante(
  grupoId: number | string,
  correo: string
) {
  try {
    // Validar sesión activa
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        mensaje: "❌ No hay sesión activa. Debes iniciar sesión para agregar participantes.",
        error: true,
      };
    }

    // Normaliza el correo
    const correoNormalizado = correo.trim().toLowerCase();

    // Buscar usuario por correo
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id, correo")
      .eq("correo", correoNormalizado)
      .single();

    if (usuarioError) {
      return { mensaje: "❌ Error al validar usuario", error: true };
    }

    if (!usuario) {
      return {
        mensaje: "⚠️ El correo ingresado no está registrado en Finedu",
        error: true,
      };
    }

    // Insertar participante usando usuario_id y correo como auxiliar
    const { error: insertError } = await supabase
      .from("participantes_grupo")
      .insert([
        {
          grupo_id: grupoId,
          usuario_id: usuario.id,     // vínculo oficial
          correo: usuario.correo,     // auxiliar para trazabilidad
          invitado_por: user.id,      // 👈 ahora sí coincide con auth.uid()
          estado: "activo",
          fecha_ingreso: new Date(),  // opcional
        },
      ]);

    if (insertError) {
      return { mensaje: "❌ Error al agregar participante", error: true };
    }

    return { mensaje: "✅ Participante agregado correctamente", error: false };
  } catch (err: any) {
    return {
      mensaje: err.message || "❌ Error inesperado al agregar participante",
      error: true,
    };
  }
}
