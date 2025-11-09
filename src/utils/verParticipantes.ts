import { supabase } from '../supabaseClient';

export async function verParticipantes(grupoId: number, usuarioId: string) {
  // 1. Validar que el usuario pertenece al grupo
  const { data: vinculo, error: errorVinculo } = await supabase
    .from('participantes_grupo')
    .select('id')
    .eq('grupo_id', grupoId)
    .eq('usuario_id', usuarioId)
    .eq('estado', 'activo')
    .single();

  if (errorVinculo || !vinculo) {
    throw new Error('No tienes acceso a los participantes de este grupo');
  }

  // 2. Obtener todos los participantes activos del grupo
  const { data: participantes, error: errorLista } = await supabase
    .from('participantes_grupo')
    .select('usuario_id, rol, fecha_ingreso, estado')
    .eq('grupo_id', grupoId)
    .eq('estado', 'activo');

  if (errorLista) throw new Error('Error al obtener la lista de participantes');

  return participantes;
}
