// src/components/Finanzas.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/MenuModulos.css";

const Finanzas: React.FC = () => {
  return (
    <div className="menu-modulos-container">
      {/* Título claro y con contraste */}
      <h2 style={{ color: "#333" }}>💵 Ingresos y Egresos</h2>

      {/* Grilla con los dos accesos internos */}
      <div className="modulo-grid">
        <Link to="/finanzas/ingresos" className="btn-modulo">
          💰 Ingresos
        </Link>
        <Link to="/finanzas/egresos" className="btn-modulo">
          💸 Egresos
        </Link>
      </div>

      {/* Mantener acceso destacado al Resumen Financiero */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ color: "#1565c0" }}>📊 Resumen Financiero</h2>
        <p style={{ fontSize: "1.1rem", color: "#2c3e50" }}>
          Tu salud financiera consolidada: ingresos, egresos, créditos y proyección a 6 meses.
        </p>
        <Link to="/finanzas/resumen" className="btn-modulo" style={{ marginTop: "1rem" }}>
          📊 Ir al Resumen Financiero
        </Link>
      </div>
    </div>
  );
};

export default Finanzas;
