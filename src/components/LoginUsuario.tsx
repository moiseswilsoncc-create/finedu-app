import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const LoginUsuario = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const enviarCorreoRecuperacion = (correo: string) => {
    console.log(`📩 Enviando correo de recuperación a ${correo}`);
    // Aquí iría la lógica real de envío
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clave.length !== 4) {
      setError("La clave debe tener exactamente 4 dígitos.");
      return;
    }

    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email: correo,
      password: clave
    });

    if (supabaseError) {
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);

      if (nuevosIntentos >= 3) {
        enviarCorreoRecuperacion(correo);
        setError("Hemos enviado un enlace de recuperación a tu correo registrado.");
      } else {
        setError("Correo o clave incorrectos. Intenta nuevamente.");
      }

      return;
    }

    localStorage.setItem("logueado", "true");
    localStorage.setItem("tipoUsuario", "usuario");
    localStorage.setItem("correoUsuario", correo);

    const nombreExtraido = correo.split("@")[0];
    localStorage.setItem("nombreUsuario", nombreExtraido);

    navigate('/panel-usuario');
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "3rem auto",
      padding: "2rem",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🔐 Acceso para usuarios registrados</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Clave personal (4 dígitos)"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>{error}</p>
        )}

        <button type="submit" style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginUsuario;
