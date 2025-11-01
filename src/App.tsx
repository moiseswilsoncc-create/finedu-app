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
import RegistroColaborador from "./components/RegistroColaborador"; // ✅ Registro colaborador
import PanelUsuario from "./components/PanelUsuario"; // ✅ Panel usuario
import IngresoColaborador from "./components/IngresoColaborador"; // ✅ Ingreso colaborador
import LoginColaborador from "./components/LoginColaborador"; // ✅ Login colaborador
import PanelColaboradores from "./components/PanelColaboradores"; // ✅ Panel colaboradores
import InvitacionColaboradores from "./components/InvitacionColaboradores"; // ✅ Invitación colaboradores

console.log("🧼 App.tsx actualizado con Bienvenida, RegistroUsuario, RegistroColaborador, IngresoColaborador, LoginColaborador, PanelUsuario, PanelColaboradores e InvitacionColaboradores");

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Bienvenida />}
      />
      <Route
        path="/registro-usuario"
        element={<RegistroUsuario />}
      />
      <Route
        path="/registro-colaborador"
        element={<RegistroColaborador />}
      />
      <Route
        path="/ingreso-colaborador"
        element={<IngresoColaborador />}
      />
      <Route
        path="/login-colaborador"
        element={<LoginColaborador />}
      />
      <Route
        path="/panel-colaboradores"
        element={<PanelColaboradores />}
      />
      <Route
        path="/panel-usuario"
        element={<PanelUsuario />}
      />
      <Route
        path="/dashboard-institucional"
        element={<DashboardInstitucional />}
      />
      <Route
        path="/editor-estado"
        element={<EditorEstadoArchivos />}
      />
      <Route
        path="/editor-trazabilidad"
        element={<EditorTrazabilidad />}
      />
      <Route
        path="/metrica-supabase"
        element={<MetricaSupabase />}
      />
      <Route
        path="/test-institucional"
        element={<TestInstitucional />}
      />
      <Route
        path="/invitacion-colaboradores"
        element={<InvitacionColaboradores />}
      />
    </Routes>
  );
};

export default App;
