import React from "react";
import { Link } from "react-router-dom";
import AsistenteFinanciero from "./AsistenteFinanciero";

const PanelUsuario = () => {
  const nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";

  return (
    <div style={{ padding: "2rem" }}>
      <h1>👋 Bienvenido, {nombreUsuario}</h1>
      <p>Este es tu espacio personalizado dentro de Finedu. Aquí puedes revisar tu progreso, acceder a tus herramientas y recibir recomendaciones inteligentes.</p>

      <section style={{ marginTop: "2rem" }}>
        <h2>🔍 Accesos rápidos</h2>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li><Link to="/registro-ahorro">💰 Registrar ahorro</Link></li>
          <li><Link to="/resumen-financiero">📊 Ver resumen financiero</Link></li>
          <li><Link to="/simulador-inversion">📈 Simular inversión</Link></li>
          <li><Link to="/test-financiero">🧠 Test financiero</Link></li>
          <li><Link to="/vista-grupal">👥 Ver metas grupales</Link></li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <AsistenteFinanciero />
      </section>

      <section style={{ marginTop: "2rem" }}>
        <Link to="/modulos" style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2ecc71",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none"
        }}>
          📂 Ver todos los módulos
        </Link>
      </section>
    </div>
  );
};

export default PanelUsuario;
