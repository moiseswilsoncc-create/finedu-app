import { supabase } from '../supabaseClient';
import { Grupo } from '../types';

// NuevoGrupo: todos los campos de Grupo menos el id
export type NuevoGrupo = Omit<Grupo, 'id'>;

export async function registrarGrupo(grupo: NuevoGrupo) {
  const { data, error } = await supabase
    .from('grupos_ahorro') // 👈 tabla correcta
    .insert([grupo])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar grupo: ${error.message}`);
  }

  return {
    mensaje: `Grupo "${data.nombre}" creado exitosamente.`,
    grupo: data as Grupo,
  };
}
