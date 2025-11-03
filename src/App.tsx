// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 🧠 Pantalla raíz y flujo de ingreso
import Bienvenida from "./components/Bienvenida";
import RegistroUsuario from "./components/RegistroUsuario";
import LoginUsuario from "./components/LoginUsuario";
import PanelUsuario from "./components/PanelUsuario";
import VistaIngresoUsuario from "./components/VistaIngresoUsuario";   // ✅ Nuevo
import VistaErrorAcceso from "./components/VistaErrorAcceso";         // ✅ Nuevo
import RecuperarClave from "./components/RecuperarClave";             // ✅ Nuevo
import NuevaClave from "./components/NuevaClave";                     // ✅ Nuevo

// 🧩 Módulo Finanzas
import Finanzas from "./components/Finanzas";
import Ingresos from "./components/Ingresos";
import Egresos from "./components/Egresos";
import ResumenFinanciero from "./components/ResumenFinanciero";
import SimuladorCreditos from "./components/SimuladorCreditos";
import ForoFinanciero from "./components/ForoFinanciero"; // 🔹 Integrado en Finanzas

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

console.log("🧼 App.tsx actualizado: rutas oficiales consolidadas");

// 🔒 Ruta protegida
const RutaProtegida: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const usuarioId = localStorage.getItem("usuarioId");
  return usuarioId ? <>{children}</> : <Navigate to="/login-usuario" replace />;
};

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <MenuModulos />
      <Routes>
        {/* Bienvenida */}
        <Route path="/" element={<Bienvenida />} />

        {/* Usuarios */}
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        <Route path="/panel-usuario" element={<PanelUsuario />} />

        {/* ✅ Flujo de acceso */}
        <Route path="/registro-exitoso" element={<VistaIngresoUsuario />} />
        <Route path="/error-acceso" element={<VistaErrorAcceso />} />
        <Route path="/recuperar-clave" element={<RecuperarClave />} />
        <Route path="/nueva-clave" element={<NuevaClave />} />

        {/* Finanzas (protegido) */}
        <Route
          path="/finanzas"
          element={
            <RutaProtegida>
              <Finanzas pais="Chile" />
            </RutaProtegida>
          }
        />
        <Route
          path="/finanzas/ingresos"
          element={
            <RutaProtegida>
              <Ingresos />
            </RutaProtegida>
          }
        />
        <Route
          path="/finanzas/egresos"
          element={
            <RutaProtegida>
              <Egresos />
            </RutaProtegida>
          }
        />
        <Route
          path="/finanzas/resumen"
          element={
            <RutaProtegida>
              <ResumenFinanciero />
            </RutaProtegida>
          }
        />
        <Route
          path="/finanzas/creditos"
          element={
            <RutaProtegida>
              <SimuladorCreditos />
            </RutaProtegida>
          }
        />
        <Route
          path="/finanzas/foro"
          element={
            <RutaProtegida>
              <ForoFinanciero />
            </RutaProtegida>
          }
        />

        {/* Colaboradores */}
        <Route path="/registro-colaborador" element={<RegistroColaborador />} />
        <Route path="/ingreso-colaborador" element={<IngresoColaborador />} />
        <Route path="/login-colaborador" element={<LoginColaborador />} />
        <Route path="/panel-colaboradores" element={<PanelColaboradores />} />
        <Route path="/invitacion-colaboradores" element={<InvitacionColaboradores />} />
        <Route path="/ofertas-colaboradores" element={<OfertasColaboradores />} />
        <Route path="/publicar-oferta-colaborador" element={<PublicarOfertaColaborador />} />
        <Route path="/datos-ofertas" element={<OfertasColaboradores />} />

        {/* Institucional */}
        <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />
        <Route path="/editor-estado" element={<EditorEstadoArchivos />} />
        <Route path="/editor-trazabilidad" element={<EditorTrazabilidad />} />
        <Route path="/metrica-supabase" element={<MetricaSupabase />} />
        <Route path="/test-institucional" element={<TestInstitucional />} />

        {/* Menú de módulos */}
        <Route path="/menu-modulos" element={<MenuModulos />} />
      </Routes>
    </>
  );
};

export default App;
