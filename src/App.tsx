import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FineduProvider } from "./context/FineduContext";
import RutaProtegida from "./components/RutaProtegida";

// [Todos tus imports originales se mantienen aquí]

function App() {
  try {
    const location = useLocation();
    const navigate = useNavigate();

    const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Meta familiar 2025");
    const [metaGrupal, setMetaGrupal] = useState(1000000);
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [tipoUsuario, setTipoUsuario] = useState<"usuario" | "colaborador" | "institucional" | null>(null);
    const [pais, setPais] = useState<string>("Chile");

    const usuario = {
      nombre: localStorage.getItem("nombreUsuario") || "Usuario",
      correo: localStorage.getItem("correoUsuario") || "",
      tipo: localStorage.getItem("tipoUsuario") || "usuario"
    };

    const agregarParticipante = (nuevo: Participante) => {
      const metaIndividual = 200000;
      const participanteConMeta: Participante = {
        ...nuevo,
        metaIndividual,
      };
      setParticipantes([...participantes, participanteConMeta]);
    };

    useEffect(() => {
      const tipo = localStorage.getItem("tipoUsuario");
      if (tipo === "usuario" || tipo === "colaborador" || tipo === "institucional") {
        setTipoUsuario(tipo as typeof tipoUsuario);
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
          {tipoUsuario && <Navbar tipoUsuario={tipoUsuario} onCerrarSesion={cerrarSesion} />}
          <Routes>
            {/* Todas tus rutas públicas, protegidas, y condicionales se mantienen exactamente igual */}
            {/* ... */}
          </Routes>

          {!tipoUsuario && location.pathname === "/" && (
            <SelectorTipoUsuario setTipoUsuario={setTipoUsuario} />
          )}

          {tipoUsuario && <BotonCerrarSesion onCerrar={cerrarSesion} />}

          {tipoUsuario && (
            <button
              onClick={() => {
                localStorage.clear();
                setTipoUsuario(null);
                navigate("/", { replace: true });
              }}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Reiniciar sesión
            </button>
          )}
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
