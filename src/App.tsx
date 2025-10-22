import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";

import VistaGrupal from "./components/VistaGrupal";
import VistaParticipante from "./components/VistaParticipante";
import VistaMetaIndividual from "./components/VistaMetaIndividual";
import VistaEtapa from "./components/VistaEtapa";
import Resumen from "./components/Resumen";
import SimuladorCredito from "./components/SimuladorCredito";
import SimuladorCreditoAuto from "./components/SimuladorCreditoAuto";
import SimuladorCreditoVivienda from "./components/SimuladorCreditoVivienda";
import SimuladorInversion from "./components/SimuladorInversion";
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

import { Participante } from "./types";

function RutaProtegida({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const logueado = localStorage.getItem("logueado") === "true";
  return logueado ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
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
    <Router>
      <div>
        {/* Navegación visible para elegir tipo de usuario */}
        {!tipoUsuario && (
          <nav style={{ marginBottom: "1rem" }}>
            <Link to="/">Inicio</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/usuario">Usuario</Link> |{" "}
            <Link to="/colaborador">Colaborador</Link> |{" "}
            <Link to="/institucional">Institucional</Link>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Bienvenida />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-clave" element={<RecuperarClave />} />
          <Route path="/nueva-clave" element={<NuevaClave />} />

          <Route
            path="/usuario"
            element={
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
            }
          />

          {tipoUsuario === "colaborador" && (
            <Route
              path="/colaborador"
              element={
                <>
                  <IngresoColaborador setPais={setPais} />
                  <PanelColaboradores pais={pais} />
                  <PanelImpacto participantes={participantes} metaGrupal={metaGrupal} pais={pais} institucion="Nombre de institución" />
                  <MetricasColaboradores participantes={participantes} metaGrupal={metaGrupal} />
                  <GeneradorPDF participantes={participantes} metaGrupal={metaGrupal} />
                  <ForoFinanciero />
                </>
              }
            />
          )}

          {tipoUsuario === "institucional" && (
            <Route
              path="/institucional"
              element={
                <VistaInstitucional participantes={participantes} metaGrupal={metaGrupal} pais={pais} setPais={setPais} />
              }
            />
          )}
        </Routes>

        {!tipoUsuario && <SelectorTipoUsuario setTipoUsuario={setTipoUsuario} />}
        {tipoUsuario && <BotonCerrarSesion onCerrar={cerrarSesion} />}
      </div>
    </Router>
  );
}

export default App;
