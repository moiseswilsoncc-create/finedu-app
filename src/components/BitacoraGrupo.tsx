// 🧠 Validación institucional: componente limpio y funcional

import React, { useEffect, useState } from 'react';
import { verHistorialGrupo, EventoHistorial } from '../utils/verHistorialGrupo';

interface Props {
  grupoId: string;
  usuarioId: string;
}

export default function BitacoraGrupo({ grupoId, usuarioId }: Props) {
  const [historial, setHistorial] = useState<EventoHistorial[]>([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarHistorial = async () => {
      setError('');
      setCargando(true);
      try {
        const data = await verHistorialGrupo(grupoId, usuarioId);
        setHistorial(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar historial');
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, [grupoId, usuarioId]);

  if (error) {
    return <p style={{ color: 'red' }}>⚠️ {error}</p>;
  }

  if (cargando) {
    return <p>⏳ Cargando historial del grupo...</p>;
  }

  if (historial.length === 0) {
    return <p>No hay eventos registrados en la bitácora del grupo.</p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>📜 Bitácora del grupo</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {historial.map((evento, index) => (
          <li key={index} style={{
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
          }}>
            <p><strong>🗓 Fecha:</strong> {new Date(evento.fecha).toLocaleString('es-CL')}</p>
            <p><strong>📌 Tipo:</strong> {evento.tipo_evento}</p>
            <p><strong>🧑 Usuario:</strong> {evento.usuario_id}</p>
            <p><strong>📝 Detalle:</strong> {evento.detalle}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
