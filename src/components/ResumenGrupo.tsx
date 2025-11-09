import React from 'react';
import { Grupo } from '../types';

interface Props {
  grupo: Grupo;
}

const ResumenGrupo: React.FC<Props> = ({ grupo }) => {
  return (
    <div
      style={{
        backgroundColor: '#ecf0f1',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '2rem',
      }}
    >
      <p><strong>📍 Ciudad:</strong> {grupo.ciudad}</p>
      <p><strong>🏘 Comuna:</strong> {grupo.comuna}</p>
      <p><strong>🌎 País:</strong> {grupo.pais}</p>
      <p><strong>🎯 Meta grupal:</strong> ${grupo.meta_grupal.toLocaleString('es-CL')}</p>
      <p><strong>📅 Fecha de creación:</strong> {new Date(grupo.fecha_creacion).toLocaleDateString('es-CL')}</p>
      <p><strong>🔐 Estado:</strong> {grupo.activo ? '✅ Activo' : '⛔️ Inactivo'}</p>
    </div>
  );
};

export default ResumenGrupo;
