import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Módulos institucionales
import DashboardInstitucional from "./institucional/DashboardInstitucional";

// Módulos colaborador
import FormularioOferta from "./componentes/FormularioOferta";

// Módulos simuladores (pendientes de activación)
// import SimuladorInversion from "./simuladores/SimuladorInversion";
// import MenuSimuladores from "./simuladores/MenuSimuladores";

// Módulos de autenticación (pendientes)
// import Login from "./auth/Login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz redirige al dashboard institucional */}
        <Route path="/" element={<Navigate to="/dashboard-institucional" replace />} />

        {/* Rutas institucionales */}
        <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />

        {/* Rutas colaborador */}
        <Route path="/colaborador/oferta" element={<FormularioOferta />} />

        {/* Rutas simuladores (activables) */}
        {/* <Route path="/simulador-inversion" element={<SimuladorInversion />} /> */}
        {/* <Route path="/menu-simuladores" element={<MenuSimuladores />} /> */}

        {/* Rutas de autenticación (activables) */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Ruta de fallback */}
        <Route path="*" element={<div style={{ padding: "2rem" }}>404 - Página no encontrada</div>} />
      </Routes>
    </Router>
  );
};

export default App;
