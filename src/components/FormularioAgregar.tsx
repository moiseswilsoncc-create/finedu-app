import React, { useState } from 'react';
import { agregarParticipante } from '../utils/agregarParticipante';

interface Props {
  grupoId: number;
  adminId: string;
}

export default function FormularioAgregar({ grupoId, adminId }: Props) {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);

    try {
      const resultado = await agregarParticipante(grupoId, correo, adminId);
      setMensaje(resultado.mensaje);
      setCorreo('');
    } catch (err: any) {
      setError(err.message || 'Error al agregar participante');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label>
        Correo del participante:
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          placeholder="correo@ejemplo.com"
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </label>

      <button type="submit" disabled={cargando} style={{ padding: '0.5rem', backgroundColor: '#007bff', color: 'white' }}>
        {cargando ? 'Agregando...' : 'Agregar participante'}
      </button>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

