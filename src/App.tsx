import React from "react";
import { Routes, Route } from "react-router-dom";

// 🧠 Módulos institucionales disponibles
import DashboardInstitucional from "./institucional/DashboardInstitucional";
import EditorEstadoArchivos from "./institucional/EditorEstadoArchivos";
import EditorTrazabilidad from "./institucional/EditorTrazabilidad";
import MetricaSupabase from "./institucional/MetricaSupabase";
import TestInstitucional from "./institucional/TestInstitucional";

console.log("🧼 App.tsx actualizado con render directo en ruta raíz y 5 módulos institucionales");

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: "2rem", fontSize: "1.5rem" }}>
            ✅ Render directo funcionando
          </div>
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
