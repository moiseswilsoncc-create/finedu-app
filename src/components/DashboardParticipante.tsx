import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Grupo } from '../types';
import { useNavigate } from 'react-router-dom';
import ResumenGrupoCompacto from './ResumenGrupoCompacto';

export default function DashboardParticipante() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarGrupos = async () => {
      const {
        data: { user },
        error: errorUsuario,
      } = await supabase.auth.getUser();

      if (errorUsuario || !user) {
        setError('No se pudo obtener el usuario actual.');
        return;
      }

      setUsuarioId(user.id);

      const { data, error: errorGrupos } = await supabase
        .from('participantes_grupo')
        .select('grupo_id, grupos(*)')
        .eq('usuario_id', user.id)
        .eq('estado', 'activo');

      if (errorGrupos) {
        setError('Error al cargar tus grupos como participante.');
        return;
      }

      const gruposFiltrados = (data || [])
        .map((registro: any) => registro.grupos)
        .filter((g: Grupo) => g && g.administrador_id !== user.id);

      setGrupos(gruposFiltrados);
    };

    cargarGrupos();
  }, []);

  const ingresarAGrupo = (grupoId: string) => {
    localStorage.setItem('grupoId', grupoId);
    navigate('/panel-grupo');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>🤝 Dashboard de participación</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h3>📌 Grupos donde participas</h3>
        {grupos.length === 0 ? (
          <p>No estás activo en ningún grupo actualmente.</p>
        ) : (
          <div>
            {grupos.map((grupo) => (
              <ResumenGrupoCompacto
                key={grupo.id}
                grupo={grupo}
                onIngresar={ingresarAGrupo}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

