import { supabase } from '../supabaseClient';

interface NuevoGrupo {
  nombre: string;
  ciudad: string;
  comuna: string;
  pais: string;
  meta_grupal: number;
  fecha_creacion: string;
  activo: boolean;
  administrador_id: string;
}

export async function registrarGrupo(grupo: NuevoGrupo) {
  const { data, error } = await supabase
    .from('grupos')
    .insert([grupo])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar grupo: ${error.message}`);
  }

  return {
    mensaje: `Grupo "${data.nombre}" creado exitosamente.`,
    grupo: data,
  };
}
