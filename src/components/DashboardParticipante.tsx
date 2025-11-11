const { data, error: errorGrupos } = await supabase
  .from('participantes_grupo')
  .select('grupo_id, grupos_ahorro(*)') // 👈 join correcto
  .eq('usuario_id', user.id)
  .eq('estado', 'activo');

if (errorGrupos) {
  setError('Error al cargar tus grupos como participante.');
  return;
}

const gruposFiltrados = (data || [])
  .map((registro: any) => registro.grupos_ahorro) // 👈 campo correcto
  .filter((g: Grupo) => g && g.administrador_id !== user.id);

setGrupos(gruposFiltrados);
