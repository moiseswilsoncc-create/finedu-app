import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FineduProvider } from "./context/FineduContext";
import RutaProtegida from "./components/RutaProtegida";

// [Mantén todos tus imports originales aquí]

function App() {
  console.log("🧪 App.tsx está montando...");

  try {
    const location = useLocation();
    const navigate = useNavigate();

    console.log("📍 location:", location);
    console.log("📍 navigate:", navigate);

    const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Meta familiar 2025");
    const [metaGrupal, setMetaGrupal] = useState(1000000);
    const [participantes, setParticipantes] = useState([]);
    const [tipoUsuario, setTipoUsuario] = useState(null);
    const [pais, setPais] = useState("Chile");

    const usuario = {
      nombre: localStorage.getItem("nombreUsuario") || "Usuario",
      correo: localStorage.getItem("correoUsuario") || "",
      tipo: localStorage.getItem("tipoUsuario") || "usuario"
    };

    const agregarParticipante = (nuevo) => {
      const metaIndividual = 200000;
      const participanteConMeta = { ...nuevo, metaIndividual };
      setParticipantes([...participantes, participanteConMeta]);
    };

    useEffect(() => {
      const tipo = localStorage.getItem("tipoUsuario");
      if (tipo === "usuario" || tipo === "colaborador" || tipo === "institucional") {
        setTipoUsuario(tipo);
      }
    }, []);

    const cerrarSesion = () => {
      localStorage.clear();
      setTipoUsuario(null);
      navigate("/", { replace: true });
    };

    return (
      <FineduProvider>
        <div>
          {/* Aquí van tus rutas y componentes, sin modificar */}
          <Routes>
            <Route path="/" element={<div>✅ React está funcionando</div>} />
          </Routes>
        </div>
      </FineduProvider>
    );
  } catch (error) {
    console.error("Error en App.tsx:", error);
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#e74c3c" }}>
        <h2>Ocurrió un error al cargar la aplicación</h2>
        <p>Por favor, intenta recargar la página o contacta soporte.</p>
      </div>
    );
  }
}

export default App;
