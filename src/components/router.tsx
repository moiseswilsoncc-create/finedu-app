import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardInicio from './components/DashboardInicio';
import PanelGrupo from './components/PanelGrupo';
import Login from './components/Login'; // opcional
import Registro from './components/Registro'; // opcional

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardInicio />} />
        <Route path="/panel-grupo" element={<PanelGrupo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="*" element={<h2 style={{ padding: '2rem' }}>404 — Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}
export default router;
