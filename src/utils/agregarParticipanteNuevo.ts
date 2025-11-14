import { supabase } from "../supabaseClient";

export async function agregarParticipanteNuevo(
  grupoId: string, // 👈 tipado seguro como string (UUID)
  correo: string
) {
  try {
    // 1. Validar sesión activa
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        mensaje:
          "❌ No hay sesión activa. Debes iniciar sesión para agregar participantes.",
        error: true,
      };
    }

    // 2. Normalizar el correo
    const correoNormalizado = correo.trim().toLowerCase();

    // 3. Buscar usuario en tabla oficial (usuarios)
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id, correo, nombre, apellido") // 👈 ahora trae nombre+apellido
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

    // 4. Insertar participante con identidad completa
    const { error: insertError } = await supabase
      .from("participantes_grupo")
      .insert([
        {
          grupo_id: grupoId,
          usuario_id: usuario.id,       // vínculo oficial
          correo: usuario.correo,       // auxiliar para trazabilidad
          nombre: usuario.nombre,       // 👈 identidad completa
          apellido: usuario.apellido,   // 👈 identidad completa
          invitado_por: user.id,        // coincide con auth.uid()
          estado: "activo",
          fecha_ingreso: new Date().toISOString(), // formato ISO
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
