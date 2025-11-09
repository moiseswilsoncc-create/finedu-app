import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import PerfilUsuario from './PerfilUsuario';

export default function RutaProtegidaPerfil() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const validarSesion = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setUsuarioAutenticado(false);
      } else {
        setUsuarioAutenticado(true);
      }

      setCargando(false);
    };

    validarSesion();
  }, []);

  if (cargando) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>⏳ Validando sesión...</p>
      </div>
    );
  }

  if (!usuarioAutenticado) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>🔒 Acceso restringido</h2>
        <p>Debes iniciar sesión para ver tu perfil.</p>
      </div>
    );
  }

  return <PerfilUsuario />;
}

