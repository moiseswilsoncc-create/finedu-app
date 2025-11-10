import React from 'react';
import { Grupo } from '../types';

interface Props {
  grupo: Grupo;
}

const ResumenGrupo: React.FC<Props> = ({ grupo }) => {
  // Validaciones seguras para evitar crash si algún campo viene null/undefined
  const ciudad = grupo?.ciudad || "No definida";
  const comuna = grupo?.comuna || "No definida";
  const pais = grupo?.pais || "No definido";
  const metaGrupal =
    typeof grupo?.meta_grupal === "number"
      ? `$${grupo.meta_grupal.toLocaleString("es-CL")}`
      : "No definida";
  const fechaCreacion = grupo?.fecha_creacion
    ? new Date(grupo.fecha_creacion).toLocaleDateString("es-CL")
    : "Sin fecha";
  const estado = grupo?.activo ? "✅ Activo" : "⛔️ Inactivo";

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
      <p><strong>📍 Ciudad:</strong> {ciudad}</p>
      <p><strong>🏘 Comuna:</strong> {comuna}</p>
      <p><strong>🌎 País:</strong> {pais}</p>
      <p><strong>🎯 Meta grupal:</strong> {metaGrupal}</p>
      <p><strong>📅 Fecha de creación:</strong> {fechaCreacion}</p>
      <p><strong>🔐 Estado:</strong> {estado}</p>
    </div>
  );
};

export default ResumenGrupo;
