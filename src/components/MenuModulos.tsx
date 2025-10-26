import React from "react";
import { Link, useNavigate } from "react-router-dom";

const modulosUsuario = [
  { ruta: "/panel-usuario", label: "👤 Panel del Usuario" },
  { ruta: "/registro-ahorro", label: "💰 Registro de Ahorro" },
  { ruta: "/simulador-inversion", label: "📈 Simulador de Inversión" },
  { ruta: "/test-financiero", label: "🧠 Test Financiero" },
  { ruta: "/resumen-financiero", label: "📊 Resumen Financiero" },
  { ruta: "/vista-grupal", label: "👨‍👩‍👧‍👦 Vista Grupal" },
  { ruta: "/admin-grupo", label: "🛠️ Administración de Grupo" },
  { ruta: "/evaluador-credito", label: "🏦 Evaluador de Crédito Inteligente" }
];

const modulosColaborador = [
  { ruta: "/panel-colaboradores", label: "🧑‍💼 Panel del Colaborador" },
  { ruta: "/admin-grupo", label: "🛠️ Administración de Grupo" },
  { ruta: "/vista-grupal", label: "👥 Vista Grupal Institucional" },
  { ruta: "/resumen-financiero", label: "📊 Reportes Financieros" }
];

const MenuModulos = () => {
  const navigate = useNavigate();
  const logueado = localStorage.getItem("logueado") === "true";
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  if (!logueado) {
    navigate("/login");
    return null;
  }

  const modulos = tipoUsuario === "colaborador" ? modulosColaborador : modulosUsuario;

  return (
    <div className="menu-modulos-container">
      <h2>📂 Accede a tus módulos</h2>
      <div className="modulo-grid">
        {modulos.map((modulo, index) => (
          <Link key={index} to={modulo.ruta} className="btn-modulo">
            {modulo.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuModulos;
