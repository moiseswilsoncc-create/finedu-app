import React from 'react';
import { Link } from 'react-router-dom';
import './FelicitacionRegistro.css'; // Personaliza estilos si lo deseas

const FelicitacionRegistro = () => {
  return (
    <div className="felicitacion-container">
      <h1>🎉 ¡Bienvenido a Finedu!</h1>
      <p className="subtitulo">
        Ya eres parte de una comunidad que transforma su economía con herramientas reales.<br />
        Desde hoy, tienes acceso total a todos los módulos, sin costos ni restricciones.
      </p>

      <h2>🧭 ¿Qué puedes hacer ahora?</h2>
      <ul className="lista-acciones">
        <li>✅ Registrar tus ingresos y gastos personales</li>
        <li>👨‍👩‍👧‍👦 Crear tu grupo familiar o comunitario</li>
        <li>📈 Simular decisiones antes de tomarlas</li>
        <li>🧾 Recibir tu informe mensual personalizado</li>
        <li>🗣️ Participar en redes internas y comparar tu economía con otros usuarios similares</li>
      </ul>

      <div className="mensaje-final">
        <p className="destacado">
          🟢 <strong>Entre más registres, más claro será tu informe.</strong><br />
          <strong>Tu economía personal y grupal empieza a tomar forma desde hoy.</strong><br />
          <strong>Finedu trabaja para ti, y tú ya estás dentro.</strong>
        </p>
      </div>

      <div className="boton-comenzar">
        <Link to="/dashboard" className="btn-principal">🚀 Comenzar ahora</Link>
      </div>
    </div>
  );
};

export default FelicitacionRegistro;
