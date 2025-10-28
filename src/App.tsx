import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TestInstitucional from "./institucional/TestInstitucional";

const App: React.FC = () => {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  useEffect(() => {
    console.log("✅ App.tsx montado");
    setTipoUsuario("institucional");
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    setTipoUsuario(null);
  };

  return (
    <Routes>
      <Route path="/dashboard-institucional" element={<TestInstitucional />} />
      <Route path="/" element={
        <div style={{ padding: "2rem", fontSize: "1.5rem", color: "#2c3e50" }}>
          Bienvenido a Finedu. Usa <code>/dashboard-institucional</code> para validar el render.
        </div>
      } />
    </Routes>
  );
};

export default App;
