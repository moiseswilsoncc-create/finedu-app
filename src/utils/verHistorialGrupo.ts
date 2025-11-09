import { supabase } from './supabaseClient';

export async function verHistorialGrupo(grupoId: number, usuarioId: string) {
  // 1. Validar que el usuario pertenece al grupo
  const { data: vinculo, error: errorVinculo } = await supabase
    .from('participantes_grupo')
    .select('id')
    .eq('grupo_id', grupoId)
    .eq('usuario_id', usuarioId)
    .eq('estado', 'activo')
    .single();

  if (errorVinculo || !vinculo) {
    throw new Error('No tienes acceso al historial de este grupo');
  }

  // 2. Obtener historial ordenado por fecha descendente
  const { data: historial, error: errorHistorial } = await supabase
    .from('historial_grupo')
    .select('tipo_evento, detalle, usuario_id, fecha')
    .eq('grupo_id', grupoId)
    .order('fecha', { ascending: false });

  if (errorHistorial) throw new Error('Error al obtener el historial del grupo');

  return historial;
}
