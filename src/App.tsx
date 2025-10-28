// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardInstitucional from "./institucional/DashboardInstitucional";

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: "2rem", fontSize: "1.5rem", color: "#444" }}>
            🏠 Inicio Finedu (React institucional)
          </div>
        }
      />
      <Route
        path="/dashboard-institucional"
        element={<DashboardInstitucional />}
      />
    </Routes>
  );
};

export default App;
