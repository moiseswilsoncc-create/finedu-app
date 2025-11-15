import { supabase } from "../supabaseClient";
import { Grupo } from "../types";

// NuevoGrupo: todos los campos de Grupo menos el id
export type NuevoGrupo = Omit<Grupo, "id">;

export async function registrarGrupo(grupo: NuevoGrupo) {
  // 1. Crear grupo
  const { data, error } = await supabase
    .from("grupos_ahorro")
    .insert([grupo])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar grupo: ${error.message}`);
  }

  // 2. Obtener datos del administrador
  const { data: admin, error: errorAdmin } = await supabase
    .from("usuarios")
    .select("nombre, apellido, correo")
    .eq("id", grupo.administrador_id)
    .single();

  if (errorAdmin || !admin) {
    throw new Error("Error al obtener datos del administrador");
  }

  // 3. Registrar evento en historial con identidad completa
  await supabase.from("historial_grupo").insert({
    grupo_id: data.id,
    usuario_id: grupo.administrador_id,
    tipo_evento: "creación",
    detalle: `El grupo "${data.nombre}" fue creado por ${admin.nombre} ${admin.apellido} (${admin.correo}).`,
  });

  return {
    mensaje: `Grupo "${data.nombre}" creado exitosamente.`,
    grupo: data as Grupo,
  };
}
