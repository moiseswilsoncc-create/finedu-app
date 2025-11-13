// src/components/Finanzas.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/MenuModulos.css";
import { useUserPerfil } from "../context/UserContext"; // 👈 integración con UserContext

const Finanzas: React.FC = () => {
  const perfil = useUserPerfil(); // 👈 obtenemos nombre+apellido+correo

  return (
    <div className="menu-modulos-container">
      <h2 style={{ color: "#333" }}>💵 Ingresos y Egresos</h2>

      {perfil && (
        <p style={{ fontWeight: "bold", color: "#2c3e50", marginBottom: "1rem" }}>
          Usuario activo: {perfil.nombre} {perfil.apellido}
        </p>
      )}

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
