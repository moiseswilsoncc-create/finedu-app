import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const BotonCerrarSesion: React.FC = () => {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      console.log("✅ Sesión cerrada correctamente");
      navigate('/login-usuario');
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión. Intenta nuevamente.");
    }
  };

  return (
    <button
      onClick={cerrarSesion}
      style={{
        padding: "0.6rem 1.2rem",
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.3s ease"
      }}
    >
      🔒 Cerrar sesión
    </button>
  );
};

export default BotonCerrarSesion;
