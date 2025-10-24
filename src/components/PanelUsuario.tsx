import React from "react";
import { useNavigate, Link } from "react-router-dom";
import AsistenteFinanciero from "./AsistenteFinanciero";

const PanelUsuario: React.FC = () => {
  const navigate = useNavigate();
  const nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";

  const modulos = [
    { nombre: "💸 Ingresos y Egresos", ruta: "/resumen-financiero", color: "#f39c12" },
    { nombre: "💰 Registro de Ahorro", ruta: "/registro-ahorro", color: "#27ae60" },
    { nombre: "👥 Mi Grupo", ruta: "/vista-grupal", color: "#2980b9" },
    { nombre: "📈 Simulador de Inversión", ruta: "/simulador-inversion", color: "#8e44ad" },
    { nombre: "🏦 Simulador de Crédito", ruta: "/simulador-credito", color: "#c0392b" },
    { nombre: "🧠 Test Financiero", ruta: "/test-financiero", color: "#16a085" },
    { nombre: "📊 Mi Progreso", ruta: "/vista-etapa", color: "#34495e" },
    { nombre: "🗣️ Foro Financiero", ruta: "/foro-financiero", color: "#2c3e50" }
  ];

  const evaluarSaludFinanciera = () => {
    const ahorro = parseInt(localStorage.getItem("ahorro") || "0");
    const cumplimiento = parseFloat(localStorage.getItem("cumplimiento") || "0");

    if (ahorro === 0 && cumplimiento === 0) {
      return {
        mensaje: "Aún no has ingresado tus datos financieros. ¡Estás a tiempo de comenzar tu camino hacia la autonomía! 🚀",
        emoji: "🕊️"
      };
    }

    if (cumplimiento >= 90) return { mensaje: "Tu salud financiera es excelente", emoji: "😊" };
    if (cumplimiento >= 70) return { mensaje: "Tu salud financiera es buena", emoji: "🙂" };
    if (cumplimiento >= 50) return { mensaje: "Tu salud financiera es regular", emoji: "😐" };
    return { mensaje: "Tu salud financiera necesita atención", emoji: "😕" };
  };

  const estadoFinanciero = evaluarSaludFinanciera();

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#3498db", marginBottom: "1rem" }}>👋 Bienvenido, {nombreUsuario}</h1>
      <p style={{ fontSize: "1.05rem", color: "#555", marginBottom: "2rem" }}>
        Este es tu espacio personalizado dentro de Finedu. Aquí puedes revisar tu progreso, acceder a tus herramientas y recibir recomendaciones inteligentes.
      </p>

      <section style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h3>📊 Estado financiero actual</h3>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          {estadoFinanciero.emoji} {estadoFinanciero.mensaje}
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>📂 Módulos disponibles</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem"
        }}>
          {modulos.map((modulo, index) => (
            <button
              key={index}
              onClick={() => navigate(modulo.ruta)}
              style={{
                padding: "1rem",
                backgroundColor: modulo.color,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer"
              }}
            >
              {modulo.nombre}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>🤖 Asistente Financiero</h2>
        <AsistenteFinanciero />
      </section>

      <section>
        <Link to="/modulos" style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2ecc71",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none"
        }}>
          📁 Ver todos los módulos
        </Link>
      </section>
    </div>
  );
};

export default PanelUsuario;
