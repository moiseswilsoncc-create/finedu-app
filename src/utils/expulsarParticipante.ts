import { supabase } from './supabaseClient';

export async function expulsarParticipante(grupoId: number, participanteId: string, adminId: string) {
  // 1. Validar que quien llama sea el admin del grupo
  const { data: grupo, error: errorGrupo } = await supabase
    .from('grupos_ahorro')
    .select('administrador_id')
    .eq('id', grupoId)
    .single();

  if (errorGrupo) throw new Error('Error al validar grupo');
  if (grupo?.administrador_id !== adminId) {
    throw new Error('No tienes permiso para expulsar participantes de este grupo');
  }

  // 2. Verificar que el usuario a expulsar sea miembro activo del grupo
  const { data: participante, error: errorParticipante } = await supabase
    .from('participantes_grupo')
    .select('id')
    .eq('grupo_id', grupoId)
    .eq('usuario_id', participanteId)
    .eq('estado', 'activo')
    .single();

  if (errorParticipante || !participante) {
    throw new Error('El participante no está activo en este grupo');
  }

  // 3. Actualizar estado a 'expulsado'
  const { error: errorUpdate } = await supabase
    .from('participantes_grupo')
    .update({ estado: 'expulsado' })
    .eq('id', participante.id);

  if (errorUpdate) throw new Error('Error al expulsar participante');

  // 4. Registrar evento en historial
  await supabase.from('historial_grupo').insert({
    grupo_id: grupoId,
    usuario_id: adminId,
    tipo_evento: 'expulsión',
    detalle: `Se expulsó al participante con ID ${participanteId} del grupo.`,
  });

  return { mensaje: 'Participante expulsado exitosamente.' };
}
