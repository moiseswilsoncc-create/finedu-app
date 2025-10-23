import React from "react";
import { Link } from "react-router-dom";
import "./MenuModulos.css"; // Puedes personalizar estilos aquí

const MenuModulos = () => {
  return (
    <div className="menu-modulos-container">
      <h2>📂 Accede a tus módulos</h2>
      <div className="modulo-grid">
        <Link to="/panel-usuario" className="btn-modulo">👤 Panel del Usuario</Link>
        <Link to="/registro-ahorro" className="btn-modulo">💰 Registro de Ahorro</Link>
        <Link to="/simulador-inversion" className="btn-modulo">📈 Simulador de Inversión</Link>
        <Link to="/test-financiero" className="btn-modulo">🧠 Test Financiero</Link>
        <Link to="/resumen-financiero" className="btn-modulo">📊 Resumen Financiero</Link>
        <Link to="/vista-grupal" className="btn-modulo">👨‍👩‍👧‍👦 Vista Grupal</Link>
        <Link to="/admin-grupo" className="btn-modulo">🛠️ Administración de Grupo</Link>
        <Link to="/evaluador-credito" className="btn-modulo">🏦 Evaluador de Crédito Inteligente</Link>
      </div>
    </div>
  );
};

export default MenuModulos;
