import React, { useState } from 'react';
import { registrarAporte } from '../utils/registrarAporte';

interface Props {
  grupoId: number | string;
  adminId: string;
}

export default function FormularioAporte({ grupoId, adminId }: Props) {
  const [participanteId, setParticipanteId] = useState('');
  const [monto, setMonto] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);

    try {
      if (!grupoId || !adminId) {
        setError("Datos de grupo o administrador inválidos");
        return;
      }

      const montoNum = parseInt(monto, 10);
      if (isNaN(montoNum) || montoNum <= 0) {
        setError("El monto debe ser un número válido mayor a 0");
        return;
      }

      const resultado = await registrarAporte(
        grupoId,
        montoNum,
        participanteId,
        adminId,
        observaciones
      );

      setMensaje(resultado?.mensaje || "Aporte registrado correctamente");
      setParticipanteId('');
      setMonto('');
      setObservaciones('');
    } catch (err: any) {
      setError(err.message || 'Error al registrar aporte');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label>
        ID del participante:
        <input
          type="text"
          value={participanteId}
          onChange={(e) => setParticipanteId(e.target.value)}
          required
          disabled={cargando}
          placeholder="Ej: 1234-uuid"
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </label>

      <label>
        Monto del aporte:
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
          disabled={cargando}
          placeholder="Ej: 5000"
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </label>

      <label>
        Observaciones (opcional):
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          disabled={cargando}
          placeholder="Ej: Aporte mensual de noviembre"
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </label>

      <button
        type="submit"
        disabled={cargando}
        style={{ padding: '0.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {cargando ? 'Registrando...' : 'Registrar aporte'}
      </button>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
