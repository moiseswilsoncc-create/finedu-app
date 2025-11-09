import React from 'react';
import TablaParticipantes from './TablaParticipantes';
import BitacoraGrupo from './BitacoraGrupo';
import { Grupo } from '../types'; // ← tipado institucional

interface Props {
  grupo: Grupo;
  usuarioId: string;
}

const PanelParticipante: React.FC<Props> = ({ grupo, usuarioId }) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>🤝 Panel de Participante — {grupo.nombre}</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3>👥 Compañeros de grupo</h3>
        <TablaParticipantes grupoId={grupo.id} adminId={usuarioId} />
      </section>

      <section>
        <h3>📜 Bitácora institucional</h3>
        <BitacoraGrupo grupoId={grupo.id.toString()} usuarioId={usuarioId} />
      </section>
    </div>
  );
};

export default PanelParticipante;
