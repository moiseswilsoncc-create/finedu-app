import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FineduProvider } from "./context/FineduContext";

// Componentes
import Bienvenida from "./components/Bienvenida";
import LoginUsuario from "./components/LoginUsuario";
import VistaIngresoUsuario from "./components/VistaIngresoUsuario";
import RegistroUsuario from "./components/RegistroUsuario";
import FelicitacionRegistro from "./components/FelicitacionRegistro";
import VistaIngresoColaborador from "./components/VistaIngresoColaborador";
import VistaInstitucional from "./components/VistaInstitucional";
import PanelUsuario from "./components/PanelUsuario";
import MenuModulos from "./components/MenuModulos";
import EditarPerfilUsuario from "./components/EditarPerfilUsuario";
import RegistroAhorro from "./components/RegistroAhorro";
import SimuladorInversion from "./components/SimuladorInversion";
import Resumen from "./components/Resumen";
import AsistenteFinanciero from "./components/AsistenteFinanciero";
import VistaMetaIndividual from "./components/VistaMetaIndividual";
import TestUsuario from "./components/TestUsuario";
import VistaGrupal from "./components/VistaGrupal";
import AdminGrupo from "./components/AdminGrupo";
import EvaluadorCreditoInteligente from "./modules/EvaluadorCreditoInteligente";
import IngresoUsuario from "./components/IngresoUsuario";
import VistaEtapa from "./components/VistaEtapa";
import VistaParticipante from "./components/VistaParticipante";
import SimuladorCredito from "./components/SimuladorCredito";
import SimuladorCreditoAuto from "./components/SimuladorCreditoAuto";
import SimuladorCreditoVivienda from "./components/SimuladorCreditoVivienda";
import GraficoAhorro from "./components/GraficoAhorro";
import PanelImpacto from "./components/PanelImpacto";
import ForoFinanciero from "./components/ForoFinanciero";
import PanelColaboradores from "./components/PanelColaboradores";
import MetricasColaboradores from "./components/MetricasColaboradores";
import GeneradorPDF from "./components/GeneradorPDF";
import InformeInstitucional from "./modules/InformeInstitucional";
import DashboardInstitucional from "./modules/DashboardInstitucional";
import Navbar from "./components/Navbar";
import BotonCerrarSesion from "./components/BotonCerrarSesion";
import SelectorTipoUsuario from "./components/SelectorTipoUsuario";
import Login from "./components/Login";
import RecuperarClave from "./components/RecuperarClave";
import NuevaClave from "./components/NuevaClave";
import LoginColaborador from "./components/LoginColaborador";
import CambioClaveColaborador from "./components/CambioClaveColaborador";

import { Participante } from "./types";

function RutaProtegida({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const logueado = localStorage.getItem("logueado") === "true";
  return logueado ? children : <Navigate to="/login-usuario" state={{ from: location }} replace />;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Meta familiar 2025");
  const [metaGrupal, setMetaGrupal] = useState(1000000);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [tipoUsuario, setTipoUsuario] = useState<"usuario" | "colaborador" | "institucional" | null>(null);
  const [pais, setPais] = useState<string>("Chile");

  const agregarParticipante = (nuevo: {
    nombre: string;
    apellido?: string;
    fechaNacimiento: string;
    ciudad: string;
    comuna: string;
    ingresos: number;
    egresos: number;
    correo?: string;
  }) => {
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
          {/* Vista pública */}
          <Route path="/" element={<Bienvenida />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-usuario" element={<LoginUsuario />} />
          <Route path="/login-colaborador" element={<LoginColaborador />} />
          <Route path="/recuperar-clave" element={<RecuperarClave />} />
          <Route path="/nueva-clave" element={<NuevaClave />} />
          <Route path="/ingreso-usuario" element={<VistaIngresoUsuario />} />
          <Route path="/registro-usuario" element={<RegistroUsuario />} />
          <Route path="/felicitacion" element={<FelicitacionRegistro />} />
          <Route path="/ingreso-colaborador" element={<VistaIngresoColaborador />} />
          <Route path="/institucional" element={
            <VistaInstitucional
              participantes={participantes}
              metaGrupal={metaGrupal}
              pais={pais}
              setPais={setPais}
            />
          } />

          {/* Rutas protegidas */}
          <Route path="/editar-perfil" element={<RutaProtegida><EditarPerfilUsuario /></RutaProtegida>} />
          <Route path="/panel-usuario" element={<RutaProtegida><PanelUsuario /></RutaProtegida>} />
          <Route path="/modulos" element={<RutaProtegida><MenuModulos /></RutaProtegida>} />
          <Route path="/registro-ahorro" element={<RutaProtegida><RegistroAhorro /></RutaProtegida>} />
          <Route path="/simulador-inversion" element={<RutaProtegida><SimuladorInversion /></RutaProtegida>} />
          <Route path="/resumen-financiero" element={<RutaProtegida><Resumen metaGrupal={metaGrupal} participantes={participantes} /></RutaProtegida>} />
          <Route path="/asistente-financiero" element={<RutaProtegida><AsistenteFinanciero /></RutaProtegida>} />
          <Route path="/mis-metas" element={<RutaProtegida><VistaMetaIndividual metas={[{ nombre: "Fondo de emergencia", objetivo: 300000, acumulado: 120000 }, { nombre: "Viaje familiar", objetivo: 1500000, acumulado: 450000 }]} /></RutaProtegida>} />
          <Route path="/test-financiero" element={<RutaProtegida><TestUsuario /></RutaProtegida>} />
          <Route path="/vista-grupal" element={<RutaProtegida><VistaGrupal nombreGrupoMeta={nombreGrupoMeta} metaGrupal={metaGrupal} participantes={participantes} /></RutaProtegida>} />
          <Route path="/admin-grupo" element={<RutaProtegida><AdminGrupo /></RutaProtegida>} />
          <Route path="/evaluador-credito" element={<RutaProtegida><EvaluadorCreditoInteligente /></RutaProtegida>} />

          {/* Usuario completo */}
          <Route path="/usuario" element={
            <RutaProtegida>
              <>
                <IngresoUsuario setPais={setPais} />
                <Resumen metaGrupal={metaGrupal} participantes={participantes} />
                <VistaEtapa participantes={participantes} />
                <VistaGrupal nombreGrupoMeta={nombreGrupoMeta} metaGrupal={metaGrupal} participantes={participantes} />
                <VistaMetaIndividual participantes={participantes} />
                <VistaParticipante onAgregar={agregarParticipante} />
                <SimuladorCredito pais={pais} />
                <SimuladorCreditoAuto pais={pais} />
                <SimuladorCreditoVivienda pais={pais} />
                <SimuladorInversion pais={pais} />
                <GraficoAhorro participantes={participantes} metaGrupal={metaGrupal} pais={pais} />
                <PanelImpacto participantes={participantes} metaGrupal={metaGrupal} pais={pais} />
                <ForoFinanciero />
              </>
            </RutaProtegida>
          } />

          {/* Colaborador completo */}
          <Route path="/colaborador" element={
            <RutaProtegida>
              <>
                <PanelColaboradores pais={pais} />
                <PanelImpacto participantes={participantes} metaGrupal={metaGrupal} pais={pais} institucion="Nombre de institución" />
                <MetricasColaboradores participantes={participantes} metaGrupal={metaGrupal} />
                <Generador
                <GeneradorPDF participantes={participantes} metaGrupal={metaGrupal} />
                <ForoFinanciero />
              </>
            </RutaProtegida>
          } />

          <Route path="/cambio-clave-colaborador" element={<RutaProtegida><CambioClaveColaborador /></RutaProtegida>} />

          {/* Institucional */}
          <Route path="/informe-institucional" element={
            <RutaProtegida>
              {tipoUsuario === "institucional"
                ? <InformeInstitucional />
                : <Navigate to="/" />}
            </RutaProtegida>
          } />

          <Route path="/dashboard-institucional" element={
            <RutaProtegida>
              {tipoUsuario === "institucional"
                ? <DashboardInstitucional />
                : <Navigate to="/" />}
            </RutaProtegida>
          } />
        </Routes>

        {/* Selector de tipo de usuario solo en la raíz */}
        {!tipoUsuario && location.pathname === "/" && (
          <SelectorTipoUsuario setTipoUsuario={setTipoUsuario} />
        )}

        {/* Botón de cierre de sesión */}
        {tipoUsuario && <BotonCerrarSesion onCerrar={cerrarSesion} />}

        {/* Botón de reinicio de sesión */}
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
}

export default App;
