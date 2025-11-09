import React from 'react';
import { Grupo } from '../types';

interface Props {
  grupo: Grupo;
  onIngresar?: (id: string) => void;
}

const ResumenGrupoCompacto: React.FC<Props> = ({ grupo, onIngresar }) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#fefefe',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <h4 style={{ marginBottom: '0.5rem' }}>{grupo.nombre}</h4>
      <p style={{ margin: 0, fontSize: '0.95rem' }}>
        {grupo.ciudad}, {grupo.pais} — Meta: ${grupo.meta_grupal.toLocaleString('es-CL')}
      </p>
      <p style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#555' }}>
        Creado el {new Date(grupo.fecha_creacion).toLocaleDateString('es-CL')}
      </p>
      <p style={{ margin: 0, fontSize: '0.85rem' }}>
        Estado: {grupo.activo ? '✅ Activo' : '⛔️ Inactivo'}
      </p>

      {onIngresar && (
        <button
          onClick={() => onIngresar(grupo.id.toString())}
          style={{
            marginTop: '0.8rem',
            padding: '0.4rem 0.8rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Ingresar al grupo
        </button>
      )}
    </div>
  );
};

export default ResumenGrupoCompacto;
