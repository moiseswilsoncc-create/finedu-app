import React, { useState } from "react";
import { useUserPerfil } from "../context/UserContext"; // 🔌 Conectamos al cerebro
import CrearGrupo from "./CrearGrupo";
// Si tienes DashboardDual, úsalo. Si no, comenta esta línea e importa tu Dashboard existente
import DashboardDual from "./DashboardDual"; 

const PanelAhorro: React.FC = () => {
  const { perfil, cargando } = useUserPerfil();
  const [modo, setModo] = useState<"personal" | "grupal" | "crear">("grupal");

  // 1. Si está cargando, mostramos espera
  if (cargando) {
    return <div className="p-8 text-blue-600 animate-pulse">⏳ Cargando Panel de Ahorro...</div>;
  }

  // 2. Si no hay perfil, mensaje de seguridad
  if (!perfil) {
    return <div className="p-8 text-red-600">⚠️ Error de sesión. Recarga la página.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* ENCABEZADO INSTITUCIONAL */}
      <header className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">💼 Panel de Ahorro</h1>
            <p className="text-gray-500">Gestiona tus aportes personales, participa en grupos o crea uno nuevo.</p>
          </div>
          <div className="text-right hidden md:block">
            <span className="block text-sm text-gray-400 uppercase tracking-wide">Usuario activo</span>
            {/* ✅ AQUÍ MOSTRAMOS EL NOMBRE DEL CONTEXTO */}
            <span className="block font-bold text-blue-800 text-lg">
              {perfil.nombre} {perfil.apellido}
            </span>
          </div>
        </div>

        {/* NAVEGACIÓN INTERNA (MODOS) */}
        <div className="mt-6 flex gap-2 border-b border-gray-200 pb-1">
          <button
            onClick={() => setModo("grupal")}
            className={`px-4 py-2 font-medium transition-colors rounded-t-lg ${
              modo === "grupal"
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            👥 Ahorro Grupal (Dashboard)
          </button>
          <button
            onClick={() => setModo("crear")}
            className={`px-4 py-2 font-medium transition-colors rounded-t-lg ${
              modo === "crear"
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            🛠️ Crear grupo de ahorro
          </button>
          {/* Botón opcional para ahorro personal futuro */}
          <button
            onClick={() => setModo("personal")}
            className={`px-4 py-2 font-medium transition-colors rounded-t-lg ${
              modo === "personal"
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            🐷 Ahorro Personal
          </button>
        </div>
      </header>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-4">
        
        {modo === "grupal" && (
          // Aquí cargamos el Dashboard que arreglamos antes
          <DashboardDual />
        )}

        {modo === "crear" && (
          // Aquí cargamos el formulario de creación
          <CrearGrupo />
        )}

        {modo === "personal" && (
          <div className="text-center p-10 text-gray-500">
            <h3 className="text-lg font-medium">Módulo en construcción 🚧</h3>
            <p>Pronto podrás gestionar tus metas personales aquí.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default PanelAhorro;
