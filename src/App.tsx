import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  useEffect(() => {
    console.log("✅ App.tsx montado");
  }, []);

  return (
    <Routes>
      <Route path="/dashboard-institucional" element={
        <div style={{
          padding: "2rem",
          fontSize: "1.5rem",
          color: "#2c3e50", // Texto oscuro
          backgroundColor: "#ecf0f1", // Fondo gris claro
          borderRadius: "8px"
        }}>
          ✅ TestInstitucional montado correctamente
        </div>
      } />
      <Route path="/" element={
        <div style={{
          padding: "2rem",
          fontSize: "1.5rem",
          color: "#2c3e50",
          backgroundColor: "#ecf0f1",
          borderRadius: "8px"
        }}>
          Bienvenido a Finedu. Usa <code>/dashboard-institucional</code> para validar el render.
        </div>
      } />
    </Routes>
  );
};

export default App;
