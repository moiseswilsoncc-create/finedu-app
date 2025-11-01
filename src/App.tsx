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

console.log("🧼 App.tsx actualizado con Bienvenida, RegistroUsuario, RegistroColaborador, IngresoColaborador y PanelUsuario");

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
        path="/registro-colaborador"
        element={
          <>
            {console.log("✅ Renderizando RegistroColaborador")}
            <RegistroColaborador />
          </>
        }
      />
      <Route
        path="/ingreso-colaborador"
        element={
          <>
            {console.log("✅ Renderizando IngresoColaborador")}
            <IngresoColaborador />
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
