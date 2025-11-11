import { supabase } from '../supabaseClient';

export async function verParticipantes(grupoId: number, usuarioId: string) {
  try {
    // 1. Validar que el usuario pertenece al grupo
    const { data: vinculo, error: errorVinculo } = await supabase
      .from('participantes_grupo')
      .select('id')
      .eq('grupo_id', grupoId)
      .eq('usuario_id', usuarioId)
      .eq('estado', 'activo')
      .single();

    if (errorVinculo || !vinculo) {
      return { mensaje: '🔒 No tienes acceso a los participantes de este grupo', error: true, data: [] };
    }

    // 2. Obtener todos los participantes activos del grupo
    const { data: participantes, error: errorLista } = await supabase
      .from('participantes_grupo')
      .select('usuario_id, rol, fecha_ingreso, estado')
      .eq('grupo_id', grupoId)
      .eq('estado', 'activo');

    if (errorLista) {
      return { mensaje: '❌ Error al obtener la lista de participantes', error: true, data: [] };
    }

    return { mensaje: '✅ Participantes cargados correctamente', error: false, data: participantes || [] };
  } catch (err: any) {
    return { mensaje: err.message || '❌ Error inesperado al obtener participantes', error: true, data: [] };
  }
}
