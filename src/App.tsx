import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FineduProvider } from "./context/FineduContext";
import RutaProtegida from "./components/RutaProtegida";
import Bienvenida from "./pages/Bienvenida";
import SelectorTipoUsuario from "./components/SelectorTipoUsuario";
import BotonCerrarSesion from "./components/BotonCerrarSesion";
import PanelUsuario from "./pages/PanelUsuario";
import PanelColaborador from "./pages/PanelColaborador";
import PanelInstitucional from "./pages/PanelInstitucional";
import ForoFinanciero from "./pages/ForoFinanciero";
import ModuloEducativo from "./pages/ModuloEducativo";
import InformeInstitucional from "./pages/InformeInstitucional";
import DashboardInstitucional from "./pages/DashboardInstitucional";

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
          <Routes>
            <Route path="/" element={<Bienvenida />} />
            <Route path="/foro" element={<ForoFinanciero />} />
            <Route path="/modulo" element={<ModuloEducativo />} />
            <Route path="/panel-usuario" element={
              <RutaProtegida tipo="usuario">
                <PanelUsuario />
              </RutaProtegida>
            } />
            <Route path="/panel-colaborador" element={
              <RutaProtegida tipo="colaborador">
                <PanelColaborador />
              </RutaProtegida>
            } />
            <Route path="/institucional" element={
              <RutaProtegida tipo="institucional">
                <PanelInstitucional />
              </RutaProtegida>
            } />
            <Route path="/informe" element={
              <RutaProtegida tipo="institucional">
                <InformeInstitucional />
              </RutaProtegida>
            } />
            <Route path="/dashboard" element={
              <RutaProtegida tipo="institucional">
                <DashboardInstitucional />
              </RutaProtegida>
            } />
            <Route path="*" element={<Navigate to="/" />} />
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

          {/* ✅ Cambio mínimo para forzar build */}
          <p style={{ display: "none" }}>Versión 692571c - validación forzada</p>
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
