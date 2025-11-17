import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Grupo } from '../types';
import PanelAdminGrupo from './PanelAdminGrupo';
import PanelParticipante from './PanelParticipante';
import ResumenGrupo from './ResumenGrupo';
import { useGrupo } from '../context/GrupoContext'; // ✅ Import del contexto institucional

const PanelGrupo: React.FC = () => {
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const grupoId = localStorage.getItem('grupoId');
  const { participantes } = useGrupo(); // ✅ Consumimos participantes desde el contexto

  useEffect(() => {
    const cargarGrupo = async () => {
      if (!grupoId) {
        setError('No se encontró el grupo asociado a tu sesión.');
        setCargando(false);
        return;
      }

      const { data: grupoData, error: errorGrupo } = await supabase
        .from('grupos')
        .select('*')
        .eq('id', grupoId)
        .single();

      if (errorGrupo || !grupoData) {
        setError('No se pudo cargar la información del grupo.');
        setCargando(false);
        return;
      }

      const {
        data: { user },
        error: errorUsuario,
      } = await supabase.auth.getUser();

      if (errorUsuario || !user) {
        setError('No se pudo obtener el usuario actual.');
        setCargando(false);
        return;
      }

      setGrupo(grupoData);
      setUsuarioId(user.id);
      setCargando(false);
    };

    cargarGrupo();
  }, [grupoId]);

  if (cargando) {
    return (
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#2980b9' }}>⏳ Cargando grupo...</h2>
      </div>
    );
  }

  if (error || !grupo || !usuarioId) {
    return (
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#c0392b' }}>⚠️ Error</h2>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>{error || 'No se pudo cargar el grupo.'}</p>
      </div>
    );
  }

  const esAdmin = grupo.administrador_id === usuarioId;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
        🧭 Panel del grupo: {grupo.nombre}
      </h2>

      <ResumenGrupo grupo={grupo} />

      {esAdmin ? (
        <PanelAdminGrupo grupo={grupo} usuarioId={usuarioId} participantes={participantes} />
      ) : (
        <PanelParticipante grupo={grupo} usuarioId={usuarioId} participantes={participantes} />
      )}
    </div>
  );
};

export default PanelGrupo;
