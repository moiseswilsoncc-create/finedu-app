import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DashboardInstitucional from "./institucional/DashboardInstitucional";
// import RutaProtegida from "./auth/RutaProtegida"; // Desactivado temporalmente para depurar

const App: React.FC = () => {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔧 Fuerza temporalmente el tipo de usuario como "institucional" para depurar el render
  useEffect(() => {
    setTipoUsuario("institucional");
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    setTipoUsuario(null);
    navigate("/", { replace: true });
  };

  return (
    <Routes>
      {/* ✅ Ruta directa sin condición para depurar pantalla en blanco */}
      <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />

      {/* 🔒 Rutas protegidas reales (desactivadas temporalmente) */}
      {/* <Route path="/dashboard-institucional" element={
        tipoUsuario === "institucional"
          ? <RutaProtegida><DashboardInstitucional /></RutaProtegida>
          : <Navigate to="/" />
      } /> */}

      {/* Ruta raíz temporal */}
      <Route path="/" element={
        <div style={{ padding: "2rem", fontSize: "1.5rem", color: "#2c3e50" }}>
          Bienvenido a Finedu. Usa <code>/dashboard-institucional</code> para validar el render.
        </div>
      } />
    </Routes>
  );
};

const RootApp: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default RootApp;
