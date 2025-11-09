import React, { useEffect, useState } from 'react';
import FormularioAgregar from './FormularioAgregar';
import FormularioAporte from './FormularioAporte';
import TablaParticipantes from './TablaParticipantes';
import BitacoraGrupo from './BitacoraGrupo';

interface Grupo {
  id: number;
  nombre: string;
  administrador_id: string;
}

interface Props {
  grupo: Grupo;
  usuarioId: string;
}

const PanelAdminGrupo: React.FC<Props> = ({ grupo, usuarioId }) => {
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    setEsAdmin(grupo.administrador_id === usuarioId);
  }, [grupo, usuarioId]);

  if (!esAdmin) {
    return <p>No tienes permisos para administrar este grupo.</p>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Panel de Administración — {grupo.nombre}</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3>👥 Participantes activos</h3>
        <TablaParticipantes grupoId={grupo.id} adminId={usuarioId} />
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>📩 Agregar participante</h3>
        <FormularioAgregar grupoId={grupo.id} adminId={usuarioId} />
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>💰 Registrar aporte</h3>
        <FormularioAporte grupoId={grupo.id} adminId={usuarioId} />
      </section>

      <section>
        <h3>📜 Bitácora institucional</h3>
        <BitacoraGrupo grupoId={grupo.id} usuarioId={usuarioId} />
      </section>
    </div>
  );
};

export default PanelAdminGrupo;
