import React, { useState } from 'react';
import { registrarGrupo } from '../utils/registrarGrupo';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Grupo } from '../types';

export default function FormularioNuevoGrupo() {
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [comuna, setComuna] = useState('');
  const [pais, setPais] = useState('');
  const [metaGrupal, setMetaGrupal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

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

      const meta = parseInt(metaGrupal);
      if (isNaN(meta) || meta <= 0) {
        throw new Error('La meta grupal debe ser un número positivo.');
      }

      // ✅ Correcciones institucionales
      const nuevoGrupo: Omit<Grupo, 'id'> = {
        nombre,
        ciudad,
        comuna,
        pais,
        meta_total: meta, // antes meta_grupal
        created_at: new Date().toISOString(), // antes fecha_creacion
        estado: "activo", // antes activo: true
        administrador_id: user.id, // uuid correcto
      };

      const resultado = await registrarGrupo(nuevoGrupo);

      // ✅ Usar id_uuid como PK
      localStorage.setItem('grupoId', resultado.grupo.id_uuid);

      navigate('/panel-grupo');
    } catch (err: any) {
      setError(err.message || 'Error al registrar grupo');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
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
