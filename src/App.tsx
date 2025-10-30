import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔁 Confirmación de limpieza de ruta rota

// 🧠 Módulos institucionales disponibles
import DashboardInstitucional from "./institucional/DashboardInstitucional";
import EditorEstadoArchivos from "./institucional/EditorEstadoArchivos";
import EditorTrazabilidad from "./institucional/EditorTrazabilidad";
import MetricaSupabase from "./institucional/MetricaSupabase";
import TestInstitucional from "./institucional/TestInstitucional";

console.log("🧼 App.tsx actualizado con 6 módulos institucionales disponibles");

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
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
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
