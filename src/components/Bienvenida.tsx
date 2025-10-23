import React from 'react';
import { Link } from 'react-router-dom';
import './Bienvenida.css'; // Personaliza estilos si lo deseas

const Bienvenida = () => {
  return (
    <div className="bienvenida-container">
      <h1>✨ Bienvenido a Finedu</h1>
      <p className="subtitulo">
        Tu plataforma independiente para tomar el control de tu economía personal.<br />
        Un espacio libre, transparente y confiable donde puedes entender tu dinero, mejorar tu ahorro y proyectar tu futuro.
      </p>

      <h2>🎁 ¿Qué puedes hacer aquí?</h2>
      <ul className="lista-beneficios">
        <li>💼 <strong>Organizar tu plata con claridad:</strong> registra tus ingresos, clasifica tus gastos y conoce tu capacidad real de gasto.</li>
        <li>📊 <strong>Medir tu propio costo de vida:</strong> descubre tu IPC personal y cómo cambian tus precios mes a mes.</li>
        <li>🧠 <strong>Recibir orientación financiera en lenguaje claro:</strong> tu agente inteligente te habla en pesos, no en porcentajes.</li>
        <li>👨‍👩‍👧‍👦 <strong>Crear grupos familiares o comunitarios:</strong> junta ingresos, registra gastos compartidos y recibe recomendaciones como hogar.</li>
        <li>📈 <strong>Simular decisiones antes de tomarlas:</strong> evalúa créditos, inversiones y cambios de presupuesto con tus datos reales.</li>
        <li>🧾 <strong>Recibir un informe mensual personalizado:</strong> con recomendaciones prácticas y visuales que entiendes.</li>
        <li>🗣️ <strong>Participar en redes internas:</strong> foro comunitario, muro de anuncios, mensajes grupales y comparación anónima con otros usuarios similares.</li>
      </ul>

      <h2>✅ Acceso total, sin letra chica</h2>
      <div className="mensaje-final">
        <p className="destacado">
          🟢 <strong>Finedu es una plataforma independiente, hecha para ti.</strong><br />
          <strong>Todos los módulos están habilitados para ti, sin costos ni restricciones, porque es ¡Gratis!!!</strong><br />
          <strong>Porque tu plata merece respeto, y tú mereces herramientas que trabajen para ti.</strong>
        </p>
      </div>

      <div className="boton-registro">
        <Link to="/registro" className="btn-principal">🚀 ¡No pierdas esta oportunidad! Registrarte Ahora</Link>
      </div>
    </div>
  );
};

export default Bienvenida;
