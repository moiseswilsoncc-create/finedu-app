// Archivo: src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// 🧠 Módulos institucionales disponibles
import DashboardInstitucional from "./institucional/DashboardInstitucional";
import EditorEstadoArchivos from "./institucional/EditorEstadoArchivos";
import EditorTrazabilidad from "./institucional/EditorTrazabilidad";
import MetricaSupabase from "./institucional/MetricaSupabase";
import TestInstitucional from "./institucional/TestInstitucional";

// 🧠 Pantalla raíz y flujo de ingreso
import Bienvenida from "./components/Bienvenida";
import RegistroUsuario from "./components/RegistroUsuario";
import LoginUsuario from "./components/LoginUsuario"; // ✅ Nuevo: login usuario
import RegistroColaborador from "./components/RegistroColaborador"; 
import PanelUsuario from "./components/PanelUsuario"; 
import IngresoColaborador from "./components/IngresoColaborador"; 
import LoginColaborador from "./components/LoginColaborador"; 
import PanelColaboradores from "./components/PanelColaboradores"; 
import InvitacionColaboradores from "./components/InvitacionColaboradores"; 

console.log("🧼 App.tsx actualizado con Bienvenida, RegistroUsuario, LoginUsuario, RegistroColaborador, IngresoColaborador, LoginColaborador, PanelUsuario, PanelColaboradores e InvitacionColaboradores");

const App: React.FC = () => {
  return (
    <Routes>
      {/* Bienvenida */}
      <Route path="/" element={<Bienvenida />} />

      {/* Usuarios */}
      <Route path="/registro-usuario" element={<RegistroUsuario />} />
      <Route path="/login-usuario" element={<LoginUsuario />} />
      <Route path="/panel-usuario" element={<PanelUsuario />} />

      {/* Colaboradores */}
      <Route path="/registro-colaborador" element={<RegistroColaborador />} />
      <Route path="/ingreso-colaborador" element={<IngresoColaborador />} />
      <Route path="/login-colaborador" element={<LoginColaborador />} />
      <Route path="/panel-colaboradores" element={<PanelColaboradores />} />
      <Route path="/invitacion-colaboradores" element={<InvitacionColaboradores />} />

      {/* Institucional */}
      <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />
      <Route path="/editor-estado" element={<EditorEstadoArchivos />} />
      <Route path="/editor-trazabilidad" element={<EditorTrazabilidad />} />
      <Route path="/metrica-supabase" element={<MetricaSupabase />} />
      <Route path="/test-institucional" element={<TestInstitucional />} />
    </Routes>
  );
};

export default App;
