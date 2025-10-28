import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TestInstitucional from "./institucional/TestInstitucional";

const App: React.FC = () => {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  useEffect(() => {
    // 🔧 Fuerza temporalmente el tipo de usuario para depurar
    setTipoUsuario("institucional");
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    setTipoUsuario(null);
    // Navegación desactivada temporalmente para evitar error
    // navigate("/", { replace: true });
  };

  return (
    <Routes>
      {/* ✅ Ruta directa para depurar */}
      <Route path="/dashboard-institucional" element={<TestInstitucional />} />

      {/* 🔒 Ruta protegida real (desactivada temporalmente) */}
      {/* <Route path="/dashboard-institucional" element={
        tipoUsuario === "institucional"
          ? <RutaProtegida><DashboardInstitucional /></RutaProtegida>
          : <Navigate to="/" />
      } /> */}

      {/* 🏠 Ruta raíz visible */}
      <Route path="/" element={
        <div style={{ padding: "2rem", fontSize: "1.5rem", color: "#2c3e50" }}>
          Bienvenido a Finedu. Usa <code>/dashboard-institucional</code> para validar el render.
        </div>
      } />
    </Routes>
  );
};

export default App;
