import React from "react";
import { Link } from "react-router-dom";
import "./FelicitacionRegistro.css"; // Opcional: personaliza estilos si lo deseas

const FelicitacionRegistro = () => {
  return (
    <div style={{
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "12px",
      backgroundColor: "#f4fefc",
      textAlign: "center"
    }}>
      <h1 style={{ color: "#2ecc71", marginBottom: "1rem" }}>🎉 ¡Bienvenido a Finedu!</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
        Ya eres parte de una comunidad que transforma su economía con herramientas reales.<br />
        Desde hoy, tienes acceso total a todos los módulos, sin costos ni restricciones.
      </p>

      <h2 style={{ marginBottom: "1rem" }}>🧭 ¿Qué puedes hacer ahora?</h2>
      <ul style={{ textAlign: "left", margin: "0 auto 2rem", maxWidth: "500px", paddingLeft: "1rem" }}>
        <li>✅ Registrar tus ingresos y gastos personales</li>
        <li>👨‍👩‍👧‍👦 Crear tu grupo familiar o comunitario</li>
        <li>📈 Simular decisiones antes de tomarlas</li>
        <li>🧾 Recibir tu informe mensual personalizado</li>
        <li>🗣️ Participar en redes internas y comparar tu economía con otros usuarios similares</li>
      </ul>

      <div style={{
        backgroundColor: "#dff0d8",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "2rem"
      }}>
        <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          🟢 Entre más registres, más claro será tu informe.<br />
          Tu economía personal y grupal empieza a tomar forma desde hoy.<br />
          Finedu trabaja para ti, y tú ya estás dentro.
        </p>
      </div>

      <Link to="/panel-usuario">
        <button style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer"
        }}>
          🚀 Comenzar ahora
        </button>
      </Link>
    </div>
  );
};

export default FelicitacionRegistro;
