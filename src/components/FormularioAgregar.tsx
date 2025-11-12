import React, { useState } from 'react';
import { agregarParticipante } from '../utils/agregarParticipanteNuevo';

interface Props {
  grupoId: number | string;
}

export default function FormularioAgregar({ grupoId }: Props) {
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
      if (!grupoId) {
        setError("⚠️ Datos de grupo inválidos");
        return;
      }

      // 👇 llamada corregida: solo grupoId + correo
      const resultado = await agregarParticipante(grupoId, correo);

      setMensaje(resultado?.mensaje || "✅ Participante agregado correctamente");
      setCorreo('');
    } catch (err: any) {
      setError(err.message || '❌ Error al agregar participante');
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
          disabled={cargando}
          placeholder="correo@ejemplo.com"
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </label>

      <button
        type="submit"
        disabled={cargando}
        style={{ padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {cargando ? 'Agregando...' : 'Agregar participante'}
      </button>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
