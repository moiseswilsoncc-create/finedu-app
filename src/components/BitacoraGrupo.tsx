import React, { useEffect, useState } from 'react';
import { verHistorialGrupo } from '../utils/verHistorialGrupo';

interface Props {
  grupoId: number;
  usuarioId: string;
}

interface Evento {
  tipo_evento: string;
  detalle: string;
  usuario_id: string;
  fecha: string;
}

export default function BitacoraGrupo({ grupoId, usuarioId }: Props) {
  const [historial, setHistorial] = useState<Evento[]>([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

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

  useEffect(() => {
    cargarHistorial();
  }, [grupoId]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cargando && <p>Cargando historial...</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {historial.map((evento, index) => (
          <li key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
            <strong>{evento.tipo_evento.toUpperCase()}</strong> — {evento.detalle}
            <br />
            <small>
              Usuario: {evento.usuario_id} | Fecha: {new Date(evento.fecha).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BitacoraGrupo;
