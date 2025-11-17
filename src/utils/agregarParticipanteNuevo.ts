import { supabase } from "../supabaseClient";

export async function agregarParticipanteNuevo(grupoId: string, correo: string) {
  try {
    // 1️⃣ Buscar usuario por correo en la tabla usuarios
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id, nombre, apellido")
      .eq("correo", correo)
      .single();

    if (errorUsuario) {
      console.error("Error al consultar usuarios:", errorUsuario.message);
      return { error: true, mensaje: "Error al validar el correo." };
    }

    // 2️⃣ Validar existencia
    if (!usuario) {
      return {
        error: true,
        mensaje: "⚠️ Este correo no está registrado en Finedu. El usuario debe crear su cuenta primero.",
      };
    }

    // 3️⃣ Insertar participante vinculado al usuario con nombre y apellido
    const { error: errorInsert } = await supabase.from("participantes_grupo").insert({
      grupo_id: grupoId,
      usuario_id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: "miembro",
      estado: "activo",
      fecha_ingreso: new Date().toISOString(),
    });

    if (errorInsert) {
      console.error("Error al insertar participante:", errorInsert.message);
      return { error: true, mensaje: "Error al agregar participante al grupo." };
    }

    // 4️⃣ Retornar datos completos para mostrar en frontend
    return {
      error: false,
      participante: {
        usuario_id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo,
        rol: "miembro",
        estado: "activo",
      },
    };
  } catch (err) {
    console.error("Error inesperado:", err);
    return { error: true, mensaje: "Error inesperado al agregar participante." };
  }
}
