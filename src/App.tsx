import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Link
} from "react-router-dom";

// Contexto institucional
import { FineduProvider } from "./context/FineduContext";

// Componentes existentes
import VistaGrupal from "./components/VistaGrupal";
import VistaParticipante from "./components/VistaParticipante";
import VistaMetaIndividual from "./components/VistaMetaIndividual";
import VistaEtapa from "./components/VistaEtapa";
import Resumen from "./components/Resumen";
import SimuladorCredito from "./components/SimuladorCredito";
import SimuladorCreditoAuto from "./components/SimuladorCreditoAuto";
import SimuladorCreditoVivienda from "./components/SimuladorCreditoVivienda";
import SimuladorInversion from "./components/SimuladorInversion";
import TestUsuario from "./components/TestUsuario";
import GraficoAhorro from "./components/GraficoAhorro";
import PanelColaboradores from "./components/PanelColaboradores";
import IngresoUsuario from "./components/IngresoUsuario";
import IngresoColaborador from "./components/IngresoColaborador";
import PanelImpacto from "./components/PanelImpacto";
import ForoFinanciero from "./components/ForoFinanciero";
import VistaInstitucional from "./components/VistaInstitucional";
import MetricasColaboradores from "./components/MetricasColaboradores";
import GeneradorPDF from "./components/GeneradorPDF";
import Login from "./components/Login";
import RecuperarClave from "./components/RecuperarClave";
import NuevaClave from "./components/NuevaClave";
import Bienvenida from "./components/Bienvenida";
import SelectorTipoUsuario from "./components/SelectorTipoUsuario";
import BotonCerrarSesion from "./components/BotonCerrarSesion";
import VistaIngresoUsuario from "./components/VistaIngresoUsuario";
import RegistroUsuario from "./components/RegistroUsuario";
import VistaIngresoColaborador from "./components/VistaIngresoColaborador";
import RegistroColaborador from "./components/RegistroColaborador";
import EditarPerfilUsuario from "./components/EditarPerfilUsuario";
import PanelUsuario from "./components/PanelUsuario";
import RegistroAhorro from "./components/RegistroAhorro";
import AdminGrupo from "./components/AdminGrupo";

// Módulos institucionales
import InformeInstitucional from "./modules/InformeInstitucional";
import DashboardInstitucional from "./modules/DashboardInstitucional";
import Navbar from "./components/Navbar";
import EvaluadorCreditoInteligente from "./modules/EvaluadorCreditoInteligente";
import MenuModulos from "./components/MenuModulos";

// ✅ NUEVO componente de felicitación post-registro
import FelicitacionRegistro from "./components/FelicitacionRegistro";

import { Participante } from "./types";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  const location = useLocation();
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
    window.location.href = "/login";
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
          <Route path="/" element={<Bienvenida />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-clave" element={<RecuperarClave />} />
          <Route path="/nueva-clave" element={<NuevaClave />} />
          <Route path="/ingreso-usuario" element={<VistaIngresoUsuario />} />
          <Route path="/registro-usuario" element={<RegistroUsuario />} />
          <Route path="/felicitacion" element={<FelicitacionRegistro />} />
          <Route path="/ingreso-colaborador" element={<VistaIngresoColaborador />} />
          <Route path="/registro-colaborador" element={<RegistroColaborador />} />
          <Route path="/editar-perfil" element={<RutaProtegida><EditarPerfilUsuario /></RutaProtegida>} />
          <Route path="/panel-usuario" element={<RutaProtegida><PanelUsuario /></RutaProtegida>} />
          <Route path="/simulador-inversion" element={<RutaProtegida><SimuladorInversion /></RutaProtegida>} />
          <Route path="/resumen-financiero" element={<RutaProtegida><Resumen activos={500000} pasivos={200000} /></RutaProtegida>} />
          <Route path="/mis-metas" element={<RutaProtegida><VistaMetaIndividual metas={[
            { nombre: "Fondo de emergencia", objetivo: 300000, acumulado: 120000 },
            { nombre: "Viaje familiar", objetivo: 1500000, acumulado: 450000 }
          ]} /></RutaProtegida>} />
          <Route path="/test-financiero" element={<RutaProtegida><TestUsuario /></RutaProtegida>} />
          <Route path="/registro-ahorro" element={<RutaProtegida><RegistroAhorro /></RutaProtegida>} />
          <Route path="/vista-grupal" element={
            <RutaProtegida>
              <VistaGrupal
                nombreGrupoMeta={nombreGrupoMeta}
                metaGrupal={metaGrupal}
                participantes={participantes}
              />
            </RutaProtegida>
          } />
          <Route path="/admin-grupo" element={<RutaProtegida><AdminGrupo /></RutaProtegida>} />
          <Route path="/evaluador-credito" element={<RutaProtegida><EvaluadorCreditoInteligente /></RutaProtegida>} />
          <Route path="/modulos" element={<RutaProtegida><MenuModulos /></RutaProtegida>} />

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

          <Route path="/colaborador" element={
            <RutaProtegida>
              <>
                <IngresoColaborador setPais={setPais} />
                <PanelColaboradores pais={pais} />
                <PanelImpacto participantes
                                  <PanelImpacto participantes={participantes} metaGrupal={metaGrupal} pais={pais} institucion="Nombre de institución" />
                <MetricasColaboradores participantes={participantes} metaGrupal={metaGrupal} />
                <GeneradorPDF participantes={participantes} metaGrupal={metaGrupal} />
                <ForoFinanciero />
              </>
            </RutaProtegida>
          } />

          <Route path="/institucional" element={
            <VistaInstitucional
              participantes={participantes}
              metaGrupal={metaGrupal}
              pais={pais}
              setPais={setPais}
            />
          } />

          <Route path="/informe-institucional" element={
            tipoUsuario === "institucional" ? (
              <RutaProtegida><InformeInstitucional /></RutaProtegida>
            ) : (
              <Navigate to="/" />
            )
          } />

          <Route path="/dashboard-institucional" element={
            tipoUsuario === "institucional" ? (
              <RutaProtegida><DashboardInstitucional /></RutaProtegida>
            ) : (
              <Navigate to="/" />
            )
          } />
        </Routes>

        {!tipoUsuario && location.pathname === "/" && (
          <SelectorTipoUsuario setTipoUsuario={setTipoUsuario} />
        )}

        {tipoUsuario && <BotonCerrarSesion onCerrar={cerrarSesion} />}
      </div>
    </FineduProvider>
  );
}

export default App;
