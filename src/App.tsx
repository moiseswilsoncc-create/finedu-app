// Archivo: src/App.tsx
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

// 🧠 Pantalla raíz y flujo de ingreso
import Bienvenida from "./components/Bienvenida";
import RegistroUsuario from "./components/RegistroUsuario";
import LoginUsuario from "./components/LoginUsuario";
import PanelUsuario from "./components/PanelUsuario";

// 🧩 Módulo Finanzas (corazón del sistema)
import Finanza from "./components/Finanza";
import Ingresos from "./components/Ingresos";
import Egresos from "./components/Egresos";
import ResumenFinanciero from "./components/ResumenFinanciero";
import SimuladorCreditos from "./components/SimuladorCreditos";

// 🧩 Otros módulos de usuario
import VistaGrupal from "./components/VistaGrupal";
import AdminGrupo from "./components/AdminGrupo";

// 🧩 Colaboradores
import RegistroColaborador from "./components/RegistroColaborador";
import IngresoColaborador from "./components/IngresoColaborador";
import LoginColaborador from "./components/LoginColaborador";
import PanelColaboradores from "./components/PanelColaboradores";
import InvitacionColaboradores from "./components/InvitacionColaboradores";
import OfertasColaboradores from "./components/OfertasColaboradores";
import PublicarOfertaColaboradores from "./components/PublicarOfertaColaboradores";
// 🧩 Institucional
import DashboardInstitucional from "./institucional/DashboardInstitucional";
import EditorEstadoArchivos from "./institucional/EditorEstadoArchivos";
import EditorTrazabilidad from "./institucional/EditorTrazabilidad";
import MetricaSupabase from "./institucional/MetricaSupabase";
import TestInstitucional from "./institucional/TestInstitucional";

// 🧩 Menú y navegación
import MenuModulos from "./components/MenuModulos";
import Navbar from "./components/Navbar";

console.log("🧼 App.tsx actualizado: mapa maestro con todas las rutas activas");
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <MenuModulos />
      <Routes>
        {/* Bienvenida */}
        <Route path="/" element={<Bienvenida />} />

        {/* Usuarios */}
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        <Route path="/panel-usuario" element={<PanelUsuario />} />

        {/* Finanzas */}
        <Route path="/finanzas" element={<Finanza pais="Chile" />} />
        <Route path="/finanzas/ingresos" element={<Ingresos />} />
        <Route path="/finanzas/egresos" element={<Egresos />} />
        <Route path="/finanzas/resumen" element={<ResumenFinanciero />} />
        <Route path="/finanzas/creditos" element={<SimuladorCreditos />} />
        {/* Otros módulos de usuario */}
        <Route path="/vista-grupal" element={<VistaGrupal />} />
        <Route path="/admin-grupo" element={<AdminGrupo />} />

        {/* Colaboradores */}
        <Route path="/registro-colaborador" element={<RegistroColaborador />} />
        <Route path="/ingreso-colaborador" element={<IngresoColaborador />} />
        <Route path="/login-colaborador" element={<LoginColaborador />} />
        <Route path="/panel-colaboradores" element={<PanelColaboradores />} />
        <Route path="/invitacion-colaboradores" element={<InvitacionColaboradores />} />
        <Route path="/ofertas-colaboradores" element={<OfertasColaboradores />} />
        <Route path="/publicar-oferta-colaborador" element={<PublicarOfertaColaborador />} />


        {/* Institucional */}
        <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />
        <Route path="/editor-estado" element={<EditorEstadoArchivos />} />
        <Route path="/editor-trazabilidad" element={<EditorTrazabilidad />} />
        <Route path="/metrica-supabase" element={<MetricaSupabase />} />
        <Route path="/test-institucional" element={<TestInstitucional />} />

        {/* Menú de módulos */}
        <Route path="/menu-modulos" element={<MenuModulos />} />
      </Routes>
    </Router>
  );
};

export default App;
