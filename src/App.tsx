// src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { usePermisos } from "./hooks/usePermisos";

// 🧠 Pantalla raíz y flujo de ingreso
import Bienvenida from "./components/Bienvenida";
import RegistroUsuario from "./components/RegistroUsuario";
import LoginUsuario from "./components/LoginUsuario";
import PanelUsuario from "./components/PanelUsuario";
import VistaErrorAcceso from "./components/VistaErrorAcceso";
import RecuperarClave from "./components/RecuperarClave";
import NuevaClave from "./components/NuevaClave";
import RegistroPendiente from "./components/RegistroPendiente";

// 🧩 Módulo Finanzas
import Finanzas from "./components/Finanzas";
import Ingresos from "./components/Ingresos";
import Egresos from "./components/Egresos";
import EgresosCategoria from "./components/EgresosCategoria";
import ResumenFinanciero from "./components/ResumenFinanciero";
import ResumenEgresos from "./components/ResumenEgresos";
import SimuladorCreditos from "./components/SimuladorCreditos";
import ForoFinanciero from "./components/ForoFinanciero";
import Categorias from "./components/Categorias";
import Items from "./components/Items";

// 🧩 Módulo Ahorro
import PanelAhorro from "./components/PanelAhorro";

// 🧩 Colaboradores
import RegistroColaborador from "./components/RegistroColaborador";
import IngresoColaborador from "./components/IngresoColaborador";
import LoginColaborador from "./components/LoginColaborador";
import PanelColaboradores from "./components/PanelColaboradores";
import InvitacionColaboradores from "./components/InvitacionColaboradores";
import OfertasColaboradores from "./components/OfertasColaboradores";
import PublicarOfertaColaborador from "./components/PublicarOfertaColaborador";

// 🧩 Institucional
import DashboardInstitucional from "./institucional/DashboardInstitucional";
import EditorEstadoArchivos from "./institucional/EditorEstadoArchivos";
import EditorTrazabilidad from "./institucional/EditorTrazabilidad";
import MetricaSupabase from "./institucional/MetricaSupabase";
import TestInstitucional from "./institucional/TestInstitucional";

// 🧩 Navegación
import MenuModulos from "./components/MenuModulos";
import Navbar from "./components/Navbar";
import VistaGrupal from "./components/VistaGrupal";

console.log("🧼 App.tsx actualizado: rutas oficiales consolidadas");

const RutaProtegida: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);

  useEffect(() => {
    const validarSesion = async () => {
      const { data, error } = await supabase.auth.getUser();
      setAutenticado(!!data.user && !error);
    };
    validarSesion();
  }, []);

  if (autenticado === null) return null;
  return autenticado ? <>{children}</> : <Navigate to="/login-usuario" replace />;
};

const RutaProtegidaColaborador: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);

  useEffect(() => {
    const validarSesion = async () => {
      const { data, error } = await supabase.auth.getUser();
      const rol = data.user?.user_metadata?.rol;
      setAutenticado(!!data.user && rol === "colaborador" && !error);
    };
    validarSesion();
  }, []);

  if (autenticado === null) return null;
  return autenticado ? <>{children}</> : <Navigate to="/login-colaborador" replace />;
};

const RutaProtegidaInstitucional: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);

  useEffect(() => {
    const validarSesion = async () => {
      const { data, error } = await supabase.auth.getUser();
      const rol = data.user?.user_metadata?.rol;
      setAutenticado(!!data.user && rol === "admin" && !error);
    };
    validarSesion();
  }, []);

  if (autenticado === null) return null;
  return autenticado ? <>{children}</> : <Navigate to="/" replace />;
};
const App: React.FC = () => {
  const location = useLocation();
  const rutasPublicas = [
    "/", "/login-usuario", "/registro-usuario", "/registro-pendiente",
    "/error-acceso", "/recuperar-clave", "/nueva-clave",
    "/login-colaborador", "/registro-colaborador", "/ingreso-colaborador"
  ];

  const mostrarNavbar = !rutasPublicas.includes(location.pathname);

  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data } = await supabase.auth.getUser();
      const id = data.user?.id || null;
      console.log("🧠 ID del usuario:", id);
      setUsuarioId(id);
    };
    obtenerUsuario();
  }, []);

  const { modulos, cargando } = usePermisos(usuarioId);

  if (cargando) return null;

  return (
    <>
      {mostrarNavbar && <Navbar />}
      {mostrarNavbar && <MenuModulos />}

      <Routes>
        {/* Bienvenida */}
        <Route path="/" element={<Bienvenida />} />

        {/* Usuarios */}
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        {modulos.includes("panel-usuario") && (
          <Route path="/panel-usuario" element={<RutaProtegida><PanelUsuario /></RutaProtegida>} />
        )}

        {/* Flujo de acceso */}
        <Route path="/registro-pendiente" element={<RegistroPendiente />} />
        <Route path="/error-acceso" element={<VistaErrorAcceso />} />
        <Route path="/recuperar-clave" element={<RecuperarClave />} />
        <Route path="/nueva-clave" element={<NuevaClave />} />

        {/* Finanzas */}
        {modulos.includes("finanzas") && (
          <>
            <Route path="/finanzas" element={<RutaProtegida><Finanzas pais="Chile" /></RutaProtegida>} />
            <Route path="/finanzas/ingresos" element={<RutaProtegida><Ingresos /></RutaProtegida>} />
            <Route path="/finanzas/egresos" element={<RutaProtegida><Egresos /></RutaProtegida>} />
            <Route path="/finanzas/egresos/:slug" element={<RutaProtegida><EgresosCategoria /></RutaProtegida>} />
            <Route path="/finanzas/resumen" element={<RutaProtegida><ResumenFinanciero /></RutaProtegida>} />
            <Route path="/finanzas/resumen-egresos" element={<RutaProtegida><ResumenEgresos pais="Chile" /></RutaProtegida>} />
            <Route path="/finanzas/creditos" element={<RutaProtegida><SimuladorCreditos /></RutaProtegida>} />
            <Route path="/finanzas/foro" element={<RutaProtegida><ForoFinanciero /></RutaProtegida>} />
            <Route path="/finanzas/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
            <Route path="/finanzas/items" element={<RutaProtegida><Items /></RutaProtegida>} />
          </>
        )}

        {/* Ahorro */}
        {modulos.includes("panel-ahorro") && (
          <Route path="/panel-ahorro" element={<RutaProtegida><PanelAhorro /></RutaProtegida>} />
        )}

        {/* Vista Grupal */}
        {modulos.includes("vista-grupal") && (
          <Route path="/vista-grupal" element={<RutaProtegida><VistaGrupal nombreGrupoMeta="" metaGrupal={0} participantes={[]} /></RutaProtegida>} />
        )}

        {/* Colaboradores */}
        <Route path="/registro-colaborador" element={<RegistroColaborador />} />
        <Route path="/ingreso-colaborador" element={<IngresoColaborador />} />
        <Route path="/login-colaborador" element={<LoginColaborador />} />
        <Route path="/panel-colaboradores" element={<RutaProtegidaColaborador><PanelColaboradores /></RutaProtegidaColaborador>} />
        <Route path="/invitacion-colaboradores" element={<RutaProtegidaColaborador><InvitacionColaboradores /></RutaProtegidaColaborador>} />
        <Route path="/ofertas-colaboradores" element={<RutaProtegidaColaborador><OfertasColaboradores /></RutaProtegidaColaborador>} />
        <Route path="/publicar-oferta-colaborador" element={<RutaProtegidaColaborador><PublicarOfertaColaborador /></RutaProtegidaColaborador>} />
        <Route path="/datos-ofertas" element={<RutaProtegidaColaborador><OfertasColaboradores /></RutaProtegidaColaborador>} />

        {/* Institucional */}
        <Route path="/dashboard-institucional" element={<RutaProtegidaInstitucional><DashboardInstitucional /></RutaProtegidaInstitucional>} />
        <Route path="/editor-estado" element={<RutaProtegidaInstitucional><EditorEstadoArchivos /></RutaProtegidaInstitucional>} />
        <Route path="/editor-trazabilidad" element={<RutaProtegidaInstitucional><EditorTrazabilidad /></RutaProtegidaInstitucional>} />
        <Route path="/metrica-supabase" element={<RutaProtegidaInstitucional><MetricaSupabase /></RutaProtegidaInstitucional>} />
        <Route path="/test-institucional" element={<RutaProtegidaInstitucional><TestInstitucional /></RutaProtegidaInstitucional>} />

        {/* Menú de módulos */}
        <Route path="/menu-modulos" element={<MenuModulos />} />
      </Routes>
    </>
  );
};

export default App;
