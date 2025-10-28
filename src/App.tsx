// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importa todos los componentes principales
import DashboardInstitucional from "./institucional/DashboardInstitucional";
// Puedes seguir agregando otros módulos aquí:
// import SimuladorInversion from "./simuladores/SimuladorInversion";
// import MenuSimuladores from "./simuladores/MenuSimuladores";
// import Login from "./auth/Login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz redirige al dashboard */}
        <Route path="/" element={<Navigate to="/dashboard-institucional" replace />} />

        {/* Rutas principales */}
        <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />

        {/* Ejemplos de otras rutas que puedes activar */}
        {/* <Route path="/simulador-inversion" element={<SimuladorInversion />} /> */}
        {/* <Route path="/menu-simuladores" element={<MenuSimuladores />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Ruta de fallback */}
        <Route path="*" element={<div style={{ padding: "2rem" }}>404 - Página no encontrada</div>} />
      </Routes>
    </Router>
  );
};

export default App;
