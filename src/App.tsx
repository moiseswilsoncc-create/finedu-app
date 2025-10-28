import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardInstitucional from "./institucional/DashboardInstitucional";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />
      <Route path="/" element={<div>🏠 Inicio Finedu</div>} />
    </Routes>
  );
};

export default App;
