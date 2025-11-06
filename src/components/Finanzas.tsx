// src/components/Finanzas.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/MenuModulos.css";

const Finanzas: React.FC = () => {
  return (
    <div className="menu-modulos-container">
      <h2 style={{ color: "#333" }}>💵 Ingresos y Egresos</h2>

      <div className="modulo-grid">
        <Link to="/finanzas/ingresos" className="btn-modulo">
          💰 Ingresos
        </Link>
        <Link to="/finanzas/egresos" className="btn-modulo">
          💸 Egresos
        </Link>
      </div>
    </div>
  );
};

export default Finanzas;
