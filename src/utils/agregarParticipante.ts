import { supabase } from './supabaseClient'; // ajusta si tu cliente está en otra ruta

export async function agregarParticipante(grupoId: number, correo: string, adminId: string) {
  // 1. Validar que el usuario que llama sea el admin del grupo
  const { data: grupo, error: errorGrupo } = await supabase
    .from('grupos_ahorro')
    .select('administrador_id')
    .eq('id', grupoId)
    .single();

  if (errorGrupo) throw new Error('Error al validar grupo');
  if (grupo?.administrador_id !== adminId) {
    throw new Error('No tienes permiso para agregar participantes a este grupo');
  }

  // 2. Buscar usuario por correo
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select('id, nombre, apellido')
    .eq('correo', correo)
    .single();

  if (errorUsuario || !usuario) {
    throw new Error('Usuario no encontrado con ese correo');
  }

  // 3. Insertar en participantes_grupo
  const { error: errorInsert } = await supabase
    .from('participantes_grupo')
    .insert({
      grupo_id: grupoId,
      usuario_id: usuario.id,
      rol: 'miembro',
      fecha_ingreso: new Date(),
      estado: 'activo',
      invitado_por: adminId
    });

  if (errorInsert) throw new Error('Error al insertar participante');

  // 4. Registrar evento en historial
  await supabase.from('historial_grupo').insert({
    grupo_id: grupoId,
    usuario_id: adminId,
    tipo_evento: 'invitación',
    detalle: `Se invitó a ${usuario.nombre} ${usuario.apellido} (${correo}) al grupo.`,
  });

  return { mensaje: 'Participante agregado exitosamente.' };
}
