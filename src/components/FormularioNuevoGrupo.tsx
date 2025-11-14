import React, { useState } from 'react';
import { registrarGrupo } from '../utils/registrarGrupo';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Grupo } from '../types';
// Ajusta la ruta según tu proyecto
import { useGrupoContext } from '../context/useGrupoContext';

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

  // Se asume que el contexto ya incluye al administrador como integrante
  const { integrantes = [] } = useGrupoContext?.() ?? { integrantes: [] };

  const integrantesCount = Array.isArray(integrantes) ? integrantes.length : 0;
  const cumpleMinIntegrantes = integrantesCount >= 2;
  const cumpleMaxIntegrantes = integrantesCount <= 100;

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

      // Validación de integrantes (mínimo 2, máximo 100)
      if (!cumpleMinIntegrantes) {
        throw new Error('⚠️ El grupo debe tener al menos 2 integrantes (administrador + participante).');
      }
      if (!cumpleMaxIntegrantes) {
        throw new Error('⚠️ El grupo no puede tener más de 100 participantes.');
      }

      // Validación de campos de texto: evitar vacíos con espacios
      const nombreOk = nombre.trim();
      const ciudadOk = ciudad.trim();
      const comunaOk = comuna.trim();
      const paisOk = pais.trim();

      if (!nombreOk || !ciudadOk || !comunaOk || !paisOk) {
        throw new Error('⚠️ Debes completar todos los campos obligatorios (sin espacios en blanco).');
      }

      // Validación de meta
      const meta = parseInt(metaGrupal, 10);
      if (isNaN(meta) || meta <= 0) {
        throw new Error('La meta grupal debe ser un número positivo.');
      }

      // Estructura institucional del grupo
      const nuevoGrupo: Omit<Grupo, 'id'> = {
        nombre: nombreOk,
        ciudad: ciudadOk,
        comuna: comunaOk,
        pais: paisOk,
        meta_total: meta,
        created_at: new Date().toISOString(),
        estado: 'activo',
        administrador_id: user.id,
      };

      const resultado = await registrarGrupo(nuevoGrupo);

      // Persistencia local del identificador institucional
      localStorage.setItem('grupoId', resultado.grupo.id_uuid);

      setMensaje('✅ Grupo creado exitosamente.');
      navigate('/panel-grupo');
    } catch (err: any) {
      setError(err.message || 'Error al registrar grupo.');
    } finally {
      setCargando(false);
    }
  };

  const botonDeshabilitado =
    cargando ||
    !cumpleMinIntegrantes ||
    !cumpleMaxIntegrantes ||
    !nombre.trim() ||
    !ciudad.trim() ||
    !comuna.trim() ||
    !pais.trim() ||
    !metaGrupal;

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

      {/* Estado de integrantes */}
      <div style={{ fontSize: '0.9rem', color: cumpleMinIntegrantes && cumpleMaxIntegrantes ? 'green' : 'orange' }}>
        Integrantes actuales: {integrantesCount} (mínimo 2, máximo 100)
      </div>

      <button type="submit" disabled={botonDeshabilitado}>
        {cargando ? 'Registrando...' : 'Registrar grupo'}
      </button>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
