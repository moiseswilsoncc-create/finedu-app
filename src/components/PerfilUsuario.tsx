import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Grupo } from '../types';
import ResumenGrupoCompacto from './ResumenGrupoCompacto';

export default function PerfilUsuario() {
  const [usuarioId, setUsuarioId] = useState('');
  const [correo, setCorreo] = useState('');
  const [gruposAdmin, setGruposAdmin] = useState<Grupo[]>([]);
  const [gruposParticipa, setGruposParticipa] = useState<Grupo[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPerfil = async () => {
      const {
        data: { user },
        error: errorUsuario,
      } = await supabase.auth.getUser();

      if (errorUsuario || !user) {
        setError('No se pudo obtener el usuario actual.');
        return;
      }

      setUsuarioId(user.id);
      setCorreo(user.email || '');

      const { data: adminData } = await supabase
        .from('grupos')
        .select('*')
        .eq('administrador_id', user.id);

      const { data: participaData } = await supabase
        .from('participantes_grupo')
        .select('grupo_id, grupos(*)')
        .eq('usuario_id', user.id)
        .eq('estado', 'activo');

      const gruposAdmin = adminData || [];
      const gruposParticipa = (participaData || [])
        .map((registro: any) => registro.grupos)
        .filter((g: Grupo) => g && g.administrador_id !== user.id);

      setGruposAdmin(gruposAdmin);
      setGruposParticipa(gruposParticipa);
    };

    cargarPerfil();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>🧑 Perfil del usuario</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '2rem', backgroundColor: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
        <p><strong>ID:</strong> {usuarioId}</p>
        <p><strong>Correo:</strong> {correo}</p>
      </div>

      <section style={{ marginBottom: '2rem' }}>
        <h3>👑 Grupos como administrador</h3>
        {gruposAdmin.length === 0 ? (
          <p>No administras ningún grupo.</p>
        ) : (
          gruposAdmin.map((grupo) => (
            <ResumenGrupoCompacto key={grupo.id} grupo={grupo} />
          ))
        )}
      </section>

      <section>
        <h3>🤝 Grupos donde participas</h3>
        {gruposParticipa.length === 0 ? (
          <p>No participas en ningún grupo actualmente.</p>
        ) : (
          gruposParticipa.map((grupo) => (
            <ResumenGrupoCompacto key={grupo.id} grupo={grupo} />
          ))
        )}
      </section>
    </div>
  );
}

export default PerfilUsuario;
