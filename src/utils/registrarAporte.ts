import { supabase } from '../supabaseClient';

export async function registrarAporte(grupoId: number, monto: number, participanteId: string, adminId: string, observaciones?: string) {
  // 1. Validar que el usuario que llama sea el admin del grupo
  const { data: grupo, error: errorGrupo } = await supabase
    .from('grupos_ahorro')
    .select('administrador_id')
    .eq('id', grupoId)
    .single();

  if (errorGrupo) throw new Error('Error al validar grupo');
  if (grupo?.administrador_id !== adminId) {
    throw new Error('No tienes permiso para registrar aportes en este grupo');
  }

  // 2. Insertar en aportes_grupales
  const { error: errorInsert } = await supabase
    .from('aportes_grupales')
    .insert({
      grupo_id: grupoId,
      usuario_id: participanteId,
      monto,
      registrado_por: adminId,
      observaciones: observaciones || null,
      fecha: new Date()
    });

  if (errorInsert) throw new Error('Error al registrar aporte');

  // 3. Registrar evento en historial
  await supabase.from('historial_grupo').insert({
    grupo_id: grupoId,
    usuario_id: adminId,
    tipo_evento: 'aporte',
    detalle: `Se registró un aporte de $${monto} para el participante ${participanteId}`,
  });

  return { mensaje: 'Aporte registrado exitosamente.' };
}
