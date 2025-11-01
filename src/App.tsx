// Archivo: src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// 🧠 Pantalla raíz y flujo de ingreso
import Bienvenida from "./components/Bienvenida";
import RegistroUsuario from "./components/RegistroUsuario";
import LoginUsuario from "./components/LoginUsuario";
import PanelUsuario from "./components/PanelUsuario";

// 🧩 Módulo Finanzas (corazón del sistema)
import Finanzas from "./components/Finanzas";
import Ingresos from "./components/Ingresos";
import Egresos from "./components/Egresos";
import ResumenFinanciero from "./components/ResumenFinanciero";

// 🧩 Otros módulos de usuario
import RegistroAhorro from "./components/RegistroAhorro";
import SimuladorInversion from "./components/SimuladorInversion";
import TestFinanciero from "./components/TestFinanciero";
import VistaGrupal from "./components/VistaGrupal";
import AdminGrupo from "./components/AdminGrupo";
import EvaluadorCredito from "./components/EvaluadorCredito";
import PanelOfertas from "./components/PanelOfertas";
import DatosOfertas from "./components/DatosOfertas";

// 🧩 Colaboradores
import RegistroColaborador from "./components/RegistroColaborador";
import IngresoColaborador from "./components/IngresoColaborador";
import LoginColaborador from "./components/LoginColaborador";
import PanelColaboradores from "./components/PanelColaboradores";
import InvitacionColaboradores from "./components/InvitacionColaboradores";

// 🧩 Institucional
import DashboardInstitucional from "./institucional/DashboardInstitucional";
import EditorEstadoArchivos from "./institucional/EditorEstadoArchivos";
import EditorTrazabilidad from "./institucional/EditorTrazabilidad";
import MetricaSupabase from "./institucional/MetricaSupabase";
import TestInstitucional from "./institucional/TestInstitucional";

// 🧩 Menú de módulos
import MenuModulos from "./components/MenuModulos";

console.log("🧼 App.tsx actualizado: mapa maestro con todas las rutas activas");

const App: React.FC = () => {
  return (
    <Routes>
      {/* Bienvenida */}
      <Route path="/" element={<Bienvenida />} />

      {/* Usuarios */}
      <Route path="/registro-usuario" element={<RegistroUsuario />} />
      <Route path="/login-usuario" element={<LoginUsuario />} />
      <Route path="/panel-usuario" element={<PanelUsuario />} />

      {/* Finanzas */}
      <Route path="/finanzas" element={<Finanzas />} />
      <Route path="/finanzas/ingresos" element={<Ingresos />} />
      <Route path="/finanzas/egresos" element={<Egresos />} />
      <Route path="/finanzas/resumen" element={<ResumenFinanciero />} />

      {/* Otros módulos de usuario */}
      <Route path="/registro-ahorro" element={<RegistroAhorro />} />
      <Route path="/simulador-inversion" element={<SimuladorInversion />} />
      <Route path="/test-financiero" element={<TestFinanciero />} />
      <Route path="/vista-grupal" element={<VistaGrupal />} />
      <Route path="/admin-grupo" element={<AdminGrupo />} />
      <Route path="/evaluador-credito" element={<EvaluadorCredito />} />
      <Route path="/panel-ofertas" element={<PanelOfertas />} />
      <Route path="/datos-ofertas" element={<DatosOfertas />} />

      {/* Colaboradores */}
      <Route path="/registro-colaborador" element={<RegistroColaborador />} />
      <Route path="/ingreso-colaborador" element={<IngresoColaborador />} />
      <Route path="/login-colaborador" element={<LoginColaborador />} />
      <Route path="/panel-colaboradores" element={<PanelColaboradores />} />
      <Route path="/invitacion-colaboradores" element={<InvitacionColaboradores />} />

      {/* Institucional */}
      <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />
      <Route path="/editor-estado" element={<EditorEstadoArchivos />} />
      <Route path="/editor-trazabilidad" element={<EditorTrazabilidad />} />
      <Route path="/metrica-supabase" element={<MetricaSupabase />} />
      <Route path="/test-institucional" element={<TestInstitucional />} />

      {/* Menú de módulos */}
      <Route path="/menu-modulos" element={<MenuModulos />} />
    </Routes>
  );
};

export default App;
