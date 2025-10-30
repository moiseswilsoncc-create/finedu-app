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
import PanelUsuario from "./components/PanelUsuario"; // ✅ Nuevo componente activado

console.log("🧼 App.tsx actualizado con Bienvenida, RegistroUsuario y PanelUsuario");

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {console.log("✅ Renderizando Bienvenida")}
            <Bienvenida />
          </>
        }
      />
      <Route
        path="/registro-usuario"
        element={
          <>
            {console.log("✅ Renderizando RegistroUsuario")}
            <RegistroUsuario />
          </>
        }
      />
      <Route
        path="/panel-usuario"
        element={
          <>
            {console.log("✅ Renderizando PanelUsuario")}
            <PanelUsuario />
          </>
        }
      />
      <Route
        path="/dashboard-institucional"
        element={
          <>
            {console.log("✅ Renderizando DashboardInstitucional")}
            <DashboardInstitucional />
          </>
        }
      />
      <Route
        path="/editor-estado"
        element={
          <>
            {console.log("✅ Renderizando EditorEstadoArchivos")}
            <EditorEstadoArchivos />
          </>
        }
      />
      <Route
        path="/editor-trazabilidad"
        element={
          <>
            {console.log("✅ Renderizando EditorTrazabilidad")}
            <EditorTrazabilidad />
          </>
        }
      />
      <Route
        path="/metrica-supabase"
        element={
          <>
            {console.log("✅ Renderizando MetricaSupabase")}
            <MetricaSupabase />
          </>
        }
      />
      <Route
        path="/test-institucional"
        element={
          <>
            {console.log("✅ Renderizando TestInstitucional")}
            <TestInstitucional />
          </>
        }
      />
    </Routes>
  );
};

export default App;
