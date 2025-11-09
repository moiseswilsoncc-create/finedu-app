import React, { useState } from 'react';
import { registrarGrupo } from '../utils/registrarGrupo';
import { supabase } from '../supabaseClient';

export default function FormularioNuevoGrupo() {
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [comuna, setComuna] = useState('');
  const [pais, setPais] = useState('');
  const [metaGrupal, setMetaGrupal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);

    try {
      const {
        data: { user },
        error: errorUsuario,
      } = await supabase.auth.getUser();

      if (errorUsuario || !user) {
        throw new Error('No se pudo obtener el usuario actual.');
      }

      const nuevoGrupo = {
        nombre,
        ciudad,
        comuna,
        pais,
        meta_grupal: parseInt(metaGrupal),
        fecha_creacion: new Date().toISOString(),
        activo: true,
        administrador_id: user.id,
      };

      const resultado = await registrarGrupo(nuevoGrupo);
      setMensaje(resultado.mensaje || 'Grupo registrado exitosamente.');
      setNombre('');
      setCiudad('');
      setComuna('');
      setPais('');
      setMetaGrupal('');
    } catch (err: any) {
      setError(err.message || 'Error al registrar grupo');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>🆕 Registrar nuevo grupo</h3>

      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del grupo"
        required
      />
      <input
        type="text"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        placeholder="Ciudad"
        required
      />
      <input
        type="text"
        value={comuna}
        onChange={(e) => setComuna(e.target.value)}
        placeholder="Comuna"
        required
      />
      <input
        type="text"
        value={pais}
        onChange={(e) => setPais(e.target.value)}
        placeholder="País"
        required
      />
      <input
        type="number"
        value={metaGrupal}
        onChange={(e) => setMetaGrupal(e.target.value)}
        placeholder="Meta grupal en CLP"
        required
        min={1}
      />

      <button type="submit" disabled={cargando}>
        {cargando ? 'Registrando...' : 'Registrar grupo'}
      </button>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
export default FormularioNuevoGrupo;
