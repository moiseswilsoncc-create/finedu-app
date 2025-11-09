import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Grupo } from '../types';
import { useNavigate } from 'react-router-dom';
import FormularioNuevoGrupo from './FormularioNuevoGrupo';

export default function DashboardInicio() {
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
        .from('grupos')
        .select('*')
        .eq('administrador_id', user.id);

      if (errorGrupos) {
        setError('Error al cargar tus grupos.');
        return;
      }

      setGrupos(data || []);
    };

    cargarGrupos();
  }, []);

  const ingresarAGrupo = (grupoId: string) => {
    localStorage.setItem('grupoId', grupoId);
    navigate('/panel-grupo');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>🏠 Dashboard de inicio</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section style={{ marginBottom: '2rem' }}>
        <h3>👑 Tus grupos como administrador</h3>
        {grupos.length === 0 ? (
          <p>No tienes grupos registrados aún.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {grupos.map((grupo) => (
              <li key={grupo.id} style={{ marginBottom: '1rem' }}>
                <strong>{grupo.nombre}</strong> — {grupo.ciudad}, {grupo.pais}
                <br />
                <button
                  onClick={() => ingresarAGrupo(grupo.id)}
                  style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem' }}
                >
                  Ingresar al grupo
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>🆕 Crear nuevo grupo</h3>
        <FormularioNuevoGrupo />
      </section>
    </div>
  );
}
export default DashboardInicio;
