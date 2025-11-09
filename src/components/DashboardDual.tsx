import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Grupo } from '../types';
import { useNavigate } from 'react-router-dom';
import FormularioNuevoGrupo from './FormularioNuevoGrupo';
import ResumenGrupoCompacto from './ResumenGrupoCompacto';

export default function DashboardDual() {
  const [gruposAdmin, setGruposAdmin] = useState<Grupo[]>([]);
  const [gruposParticipa, setGruposParticipa] = useState<Grupo[]>([]);
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

      const { data: adminData, error: errorAdmin } = await supabase
        .from('grupos')
        .select('*')
        .eq('administrador_id', user.id);

      const { data: participaData, error: errorParticipa } = await supabase
        .from('participantes_grupo')
        .select('grupo_id, grupos(*)')
        .eq('usuario_id', user.id)
        .eq('estado', 'activo');

      if (errorAdmin || errorParticipa) {
        setError('Error al cargar tus grupos.');
        return;
      }

      const gruposAdmin = adminData || [];
      const gruposParticipa = (participaData || [])
        .map((registro: any) => registro.grupos)
        .filter((g: Grupo) => g && g.administrador_id !== user.id);

      setGruposAdmin(gruposAdmin);
      setGruposParticipa(gruposParticipa);
    };

    cargarGrupos();
  }, []);

  const ingresarAGrupo = (grupoId: string) => {
    localStorage.setItem('grupoId', grupoId);
    navigate('/panel-grupo');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>📊 Dashboard institucional</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section style={{ marginBottom: '2rem' }}>
        <h3>👑 Grupos como administrador</h3>
        {gruposAdmin.length === 0 ? (
          <p>No tienes grupos registrados aún.</p>
        ) : (
          gruposAdmin.map((grupo) => (
            <ResumenGrupoCompacto
              key={grupo.id}
              grupo={grupo}
              onIngresar={ingresarAGrupo}
            />
          ))
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>🤝 Grupos donde participas</h3>
        {gruposParticipa.length === 0 ? (
          <p>No estás activo en ningún grupo actualmente.</p>
        ) : (
          gruposParticipa.map((grupo) => (
            <ResumenGrupoCompacto
              key={grupo.id}
              grupo={grupo}
              onIngresar={ingresarAGrupo}
            />
          ))
        )}
      </section>

      <section>
        <h3>🆕 Crear nuevo grupo</h3>
        <FormularioNuevoGrupo />
      </section>
    </div>
  );
}

export default DashboardDual;
