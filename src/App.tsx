import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardInstitucional from "./institucional/DashboardInstitucional";

const App: React.FC = () => {
  useEffect(() => {
    console.log("✅ App.tsx montado");
  }, []);

  return (
    <Routes>
      <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />
      <Route path="/" element={
        <div>
          Bienvenido a Finedu. Usa <code>/dashboard-institucional</code> para validar el render.
        </div>
      } />
    </Routes>
  );
};

export default App;
