import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  useEffect(() => {
    console.log("✅ App.tsx montado");
  }, []);

  return (
    <Routes>
      <Route path="/dashboard-institucional" element={
        <div>
          ✅ TestInstitucional montado correctamente
        </div>
      } />
      <Route path="/" element={
        <div>
          Bienvenido a Finedu. Usa <code>/dashboard-institucional</code> para validar el render.
        </div>
      } />
    </Routes>
  );
};

export default App;
