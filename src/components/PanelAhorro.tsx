import React, { useState } from "react";
import { useUserPerfil } from "../context/UserContext";
import CrearGrupo from "./CrearGrupo";

const PanelAhorro: React.FC = () => {
  const { perfil, cargando } = useUserPerfil();
  const [modo, setModo] = useState<"personal" | "grupal" | "crear">("crear"); // 👈 Cambiado a "crear" por defecto

  // 1. Si está cargando, mostramos espera
  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-blue-600 text-xl font-semibold animate-pulse">
          ⏳ Cargando Panel de Ahorro...
        </div>
      </div>
    );
  }

  // 2. Si no hay perfil, mensaje de seguridad
  if (!perfil) {
    return (
      <div className="p-8 text-center border rounded bg-red-50 text-red-600">
        ⚠️ Error de sesión. Por favor recarga la página.
      </div>
    );
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
            <span className="block font-bold text-blue-800 text-lg">
              {perfil.nombre} {perfil.apellido}
            </span>
          </div>
        </div>

        {/* NAVEGACIÓN INTERNA (MODOS) */}
        <div className="mt-6 flex gap-2 border-b border-gray-200 pb-1">
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
          
          <button
            onClick={() => setModo("grupal")}
            className={`px-4 py-2 font-medium transition-colors rounded-t-lg ${
              modo === "grupal"
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            👥 Mis grupos
          </button>

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
      <main className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-6">
        
        {/* MODO: CREAR GRUPO */}
        {modo === "crear" && (
          <div>
            <CrearGrupo />
          </div>
        )}

        {/* MODO: MIS GRUPOS (VISTA SIMPLIFICADA) */}
        {modo === "grupal" && (
          <div className="text-center p-10">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">👥 Tus Grupos de Ahorro</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <p className="text-gray-600 mb-4">
                📊 Aquí verás los grupos donde participas y los que administras
              </p>
              <p className="text-sm text-gray-500">
                🚧 Módulo en desarrollo - Próximamente podrás ver:
              </p>
              <ul className="text-left mt-4 space-y-2 text-gray-600 max-w-md mx-auto">
                <li>✓ Grupos donde eres administrador</li>
                <li>✓ Grupos donde eres participante</li>
                <li>✓ Progreso de aportes</li>
                <li>✓ Metas alcanzadas</li>
              </ul>
            </div>
            <button
              onClick={() => setModo("crear")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              🛠️ Crear mi primer grupo
            </button>
          </div>
        )}

        {/* MODO: AHORRO PERSONAL */}
        {modo === "personal" && (
          <div className="text-center p-10">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">🐷 Ahorro Personal</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                💰 Gestiona tus metas de ahorro individuales
              </p>
              <p className="text-sm text-gray-500">
                🚧 Módulo en desarrollo - Próximamente podrás:
              </p>
              <ul className="text-left mt-4 space-y-2 text-gray-600 max-w-md mx-auto">
                <li>✓ Definir metas personales</li>
                <li>✓ Registrar aportes mensuales</li>
                <li>✓ Ver tu progreso</li>
                <li>✓ Recibir recomendaciones</li>
              </ul>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER INFORMATIVO */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>💡 Tip: Crea un grupo para ahorrar junto a familia o amigos con una meta común</p>
      </footer>
    </div>
  );
};

export default PanelAhorro;
