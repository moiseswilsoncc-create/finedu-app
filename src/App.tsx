import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link
} from "react-router-dom";

import { FineduProvider } from "./context/FineduContext";
import { Participante } from "./types";

// Componentes base
import Navbar from "./components/Navbar";
import RutaProtegida from "./components/RutaProtegida";
import SelectorTipoUsuario from "./components/SelectorTipoUsuario";
import BotonCerrarSesion from "./components/BotonCerrarSesion";
import Bienvenida from "./components/Bienvenida";
import Login from "./components/Login";
import RecuperarClave from "./components/RecuperarClave";
import NuevaClave from "./components/NuevaClave";
import VistaIngresoUsuario from "./components/VistaIngresoUsuario";
import RegistroUsuario from "./components/RegistroUsuario";
import FelicitacionRegistro from "./components/FelicitacionRegistro";
import VistaIngresoColaborador from "./components/VistaIngresoColaborador";
import RegistroColaborador from "./components/RegistroColaborador";
import EditarPerfilUsuario from "./components/EditarPerfilUsuario";

// Componentes usuario
import PanelUsuario from "./components/PanelUsuario";
import SimuladorInversion from "./components/SimuladorInversion";
import Resumen from "./components/Resumen";
import AsistenteFinanciero from "./components/AsistenteFinanciero";
import VistaMetaIndividual from "./components/VistaMetaIndividual";
import TestUsuario from "./components/TestUsuario";
import RegistroAhorro from "./components/RegistroAhorro";
import VistaGrupal from "./components/VistaGrupal";
import VistaEtapa from "./components/VistaEtapa";
import VistaParticipante from "./components/VistaParticipante";
import SimuladorCredito from "./components/SimuladorCredito";
import SimuladorCreditoAuto from "./components/SimuladorCreditoAuto";
import SimuladorCreditoVivienda from "./components/SimuladorCreditoVivienda";
import GraficoAhorro from "./components/GraficoAhorro";
import PanelImpacto from "./components/PanelImpacto";
import ForoFinanciero from "./components/ForoFinanciero";

// Componentes colaborador
import IngresoUsuario from "./components/IngresoUsuario";
import IngresoColaborador from "./components/IngresoColaborador";
import PanelColaboradores from "./components/PanelColaboradores";
import MetricasColaboradores from "./components/MetricasColaboradores";
import GeneradorPDF from "./components/GeneradorPDF";
import DatosOfertas from "./components/DatosOfertas";
import OfertasColaborador from "./components/OfertaColaboradores";

// Componentes institucionales
import VistaInstitucional from "./components/VistaInstitucional";
import MenuModulos from "./components/MenuModulos";
import MenuSimuladores from "./components/MenuSimuladores";

// Módulos institucionales
import InformeInstitucional from "./modules/InformeInstitucional";
import DashboardInstitucional from "./modules/DashboardInstitucional";
import EvaluadorCreditoInteligente from "./modules/EvaluadorCreditoInteligente";
function App() {
  try {
    const location = useLocation();
    const navigate = useNavigate();

    const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Meta familiar 2025");
    const [metaGrupal, setMetaGrupal] = useState(1000000);
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [tipoUsuario, setTipoUsuario] = useState<"usuario" | "colaborador" | "institucional" | null>(null);
    const [pais, setPais] = useState<string>("Chile");

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

          {!tipoUsuario && location.pathname === "/" && (
            <nav style={{ marginBottom: "1rem", textAlign: "center" }}>
              <Link to="/ingreso-usuario">👤 Ingresar como usuario</Link> |{" "}
              <Link to="/ingreso-colaborador">🤝 Ingresar como colaborador</Link> |{" "}
              <Link to="/institucional">🏛️ Vista institucional</Link>
            </nav>
          )}

          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Bienvenida />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-clave" element={<RecuperarClave />} />
            <Route path="/nueva-clave" element={<NuevaClave />} />
            <Route path="/ingreso-usuario" element={<VistaIngresoUsuario />} />
            <Route path="/registro-usuario" element={<RegistroUsuario />} />
            <Route path="/felicitacion" element={<FelicitacionRegistro />} />
            <Route path="/ingreso-colaborador" element={<VistaIngresoColaborador />} />
            <Route path="/registro-colaborador" element={<RegistroColaborador />} />

            {/* Rutas protegidas usuario */}
            <Route path="/editar-perfil" element={<RutaProtegida><EditarPerfilUsuario /></RutaProtegida>} />
            <Route path="/panel-usuario" element={<RutaProtegida><PanelUsuario /></RutaProtegida>} />
            <Route path="/simulador-inversion" element={<RutaProtegida><SimuladorInversion /></RutaProtegida>} />
            <Route path="/resumen-financiero" element={<RutaProtegida><Resumen activos={500000} pasivos={200000} /></RutaProtegida>} />
            <Route path="/asistente-financiero" element={<RutaProtegida><AsistenteFinanciero /></RutaProtegida>} />
            <Route path="/mis-metas" element={<RutaProtegida><VistaMetaIndividual metas={[
              { nombre: "Fondo de emergencia", objetivo: 300000, acumulado: 120000 },
              { nombre: "Viaje familiar", objetivo: 1500000, acumulado: 450000 }
            ]} /></RutaProtegida>} />
            <Route path="/test-financiero" element={<RutaProtegida><TestUsuario /></RutaProtegida>} />
            <Route path="/registro-ahorro" element={<RutaProtegida><RegistroAhorro /></RutaProtegida>} />
            <Route path="/vista-grupal" element={<RutaProtegida><VistaGrupal nombreGrupoMeta={nombreGrupoMeta} metaGrupal={metaGrupal} participantes={participantes} /></RutaProtegida>} />
            <Route path="/admin-grupo" element={<RutaProtegida><VistaEtapa /></RutaProtegida>} />
            <Route path="/evaluador-credito" element={<RutaProtegida><EvaluadorCreditoInteligente /></RutaProtegida>} />
            <Route path="/modulos" element={<RutaProtegida><MenuModulos /></RutaProtegida>} />
            <Route path="/simuladores" element={<RutaProtegida><MenuSimuladores /></RutaProtegida>} />
            <Route path="/datos-ofertas" element={<RutaProtegida><DatosOfertas /></RutaProtegida>} />

            {/* Rutas colaborador */}
            <Route path="/colaborador" element={
              <RutaProtegida>
                <>
                  <IngresoColaborador setPais={setPais} />
                  <PanelColaboradores pais={pais} />
                  <PanelImpacto participantes={participantes} metaGrupal={metaGrupal} pais={pais} institucion="Nombre de institución" />
                  <MetricasColaboradores participantes={participantes} metaGrupal={metaGrupal} />
                  <GeneradorPDF participantes={participantes} metaGrupal={metaGrupal} />
                  <DatosOfertas />
                  <OfertasColaborador />
                  <ForoFinanciero />
                </>
              </RutaProtegida>
            } />

            {/* Rutas institucionales */}
            <Route path="/institucional" element={
              <VistaInstitucional
                participantes={participantes}
                metaGrupal={metaGrupal}
                pais={pais}
                setPais={setPais}
              />
            } />

            <Route path="/informe-institucional" element={
              tipoUsuario === "institucional"
                ? <RutaProtegida><InformeInstitucional /></RutaProtegida>
                : <Navigate to="/" />
            } />

            <Route path="/dashboard-institucional" element={
              tipoUsuario === "institucional"
                ? <RutaProtegida><DashboardInstitucional /></Ruta} />
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

                                                             
