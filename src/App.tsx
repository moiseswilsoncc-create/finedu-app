import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧠 Institucional
import DashboardInstitucional from "./institucional/DashboardInstitucional";
import SimulacionInstitucional from "./institucional/SimulacionInstitucional";
import PanelMetrico from "./institucional/PanelMetrico";
import VerUsuarios from "./institucional/VerUsuarios";
import VerEvaluaciones from "./institucional/VerEvaluaciones";
import VerPublicaciones from "./institucional/VerPublicaciones";
import VerReputaciones from "./institucional/VerReputaciones";
import VerResumenInstitucional from "./institucional/VerResumenInstitucional";
import VerFeedbackInstitucional from "./institucional/VerFeedbackInstitucional";
import VerMensajesInstitucional from "./institucional/VerMensajesInstitucional";
import VerAhorrosGrupales from "./institucional/VerAhorrosGrupales";
import VerCreditosActivos from "./institucional/VerCreditosActivos";
import VerIngresoMensualGrupal from "./institucional/VerIngresoMensualGrupal";
import VerUsuariosConDiscapacidad from "./institucional/VerUsuariosConDiscapacidad";
import VerMetricasComparadas from "./institucional/VerMetricasComparadas";
import VerUsuariosPorRol from "./institucional/VerUsuariosPorRol";
import VerEvaluacionesPorModulo from "./institucional/VerEvaluacionesPorModulo";
import VerPublicacionesPorUsuario from "./institucional/VerPublicacionesPorUsuario";
import VerReaccionesPorTipo from "./institucional/VerReaccionesPorTipo";
import VerSimulacionesPorGrupo from "./institucional/VerSimulacionesPorGrupo";
import VerCreditosPorUsuario from "./institucional/VerCreditosPorUsuario";
import VerAhorrosPorUsuario from "./institucional/VerAhorrosPorUsuario";
import VerFeedbackPorModulo from "./institucional/VerFeedbackPorModulo";
import VerMensajesPorTipo from "./institucional/VerMensajesPorTipo";
import VerActividadPorModulo from "./institucional/VerActividadPorModulo";
import VerUsuariosSinSimulacion from "./institucional/VerUsuariosSinSimulacion";
import VerUsuariosConEvaluacionBaja from "./institucional/VerUsuariosConEvaluacionBaja";
import VerUsuariosConAccesibilidad from "./institucional/VerUsuariosConAccesibilidad";
import VerComparativaFinanciera from "./institucional/VerComparativaFinanciera";
import VerSimulacionesPorModulo from "./institucional/VerSimulacionesPorModulo";

// 🤝 Colaborador
import FormularioOferta from "./colaborador/FormularioOferta";
import VisualizacionOfertas from "./colaborador/VisualizacionOfertas";
import VerHistorialOfertas from "./colaborador/VerHistorialOfertas";
import VerOfertasExpiradas from "./colaborador/VerOfertasExpiradas";

// 📊 Simuladores
import SimuladorInversion from "./simuladores/SimuladorInversion";
import SimuladorCredito from "./simuladores/SimuladorCredito";
import AhorroGrupal from "./simuladores/AhorroGrupal";
import MenuSimuladores from "./simuladores/MenuSimuladores";
import VerSimulaciones from "./simuladores/VerSimulaciones";
import DetalleSimulacion from "./simuladores/DetalleSimulacion";

// 💬 Red social y evaluación
import RedSocialFinanciera from "./rrss/RedSocialFinanciera";
import EvaluacionSistema from "./rrss/EvaluacionSistema";

// ⚙️ Usuario
import ConfiguracionUsuario from "./usuario/ConfiguracionUsuario";
import ResumenFinanciero from "./usuario/ResumenFinanciero";
import MensajesSistema from "./usuario/MensajesSistema";
import ActividadUsuario from "./usuario/ActividadUsuario";
import FeedbackUsuario from "./usuario/FeedbackUsuario";
import IngresoMensual from "./usuario/IngresoMensual";
import VerActividadGrupal from "./usuario/VerActividadGrupal";

// 🔐 Autenticación
import Login from "./auth/Login";

console.log("✅ App.tsx ensamblado con 50 módulos auditados");

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Institucional */}
        <Route path="/dashboard-institucional" element={<DashboardInstitucional />} />
        <Route path="/simulacion-institucional" element={<SimulacionInstitucional />} />
        <Route path="/panel-metrico" element={<PanelMetrico />} />
        <Route path="/usuarios" element={<VerUsuarios />} />
        <Route path="/evaluaciones" element={<VerEvaluaciones />} />
        <Route path="/publicaciones" element={<VerPublicaciones />} />
        <Route path="/reputaciones" element={<VerReputaciones />} />
        <Route path="/resumen-institucional" element={<VerResumenInstitucional />} />
        <Route path="/feedback-institucional" element={<VerFeedbackInstitucional />} />
        <Route path="/mensajes-institucional" element={<VerMensajesInstitucional />} />
        <Route path="/ahorros-grupales" element={<VerAhorrosGrupales />} />
        <Route path="/creditos-activos" element={<VerCreditosActivos />} />
        <Route path="/ingresos-grupales" element={<VerIngresoMensualGrupal />} />
        <Route path="/usuarios-discapacidad" element={<VerUsuariosConDiscapacidad />} />
        <Route path="/metricas-comparadas" element={<VerMetricasComparadas />} />
        <Route path="/usuarios-por-rol" element={<VerUsuariosPorRol />} />
        <Route path="/evaluaciones-por-modulo" element={<VerEvaluacionesPorModulo />} />
        <Route path="/publicaciones-por-usuario" element={<VerPublicacionesPorUsuario />} />
        <Route path="/reacciones-por-tipo" element={<VerReaccionesPorTipo />} />
        <Route path="/simulaciones-por-grupo" element={<VerSimulacionesPorGrupo />} />
        <Route path="/creditos-por-usuario" element={<VerCreditosPorUsuario />} />
        <Route path="/ahorros-por-usuario" element={<VerAhorrosPorUsuario />} />
        <Route path="/feedback-por-modulo" element={<VerFeedbackPorModulo />} />
        <Route path="/mensajes-por-tipo" element={<VerMensajesPorTipo />} />
        <Route path="/actividad-por-modulo" element={<VerActividadPorModulo />} />
        <Route path="/usuarios-sin-simulacion" element={<VerUsuariosSinSimulacion />} />
        <Route path="/usuarios-evaluacion-baja" element={<VerUsuariosConEvaluacionBaja />} />
        <Route path="/usuarios-accesibilidad" element={<VerUsuariosConAccesibilidad />} />
        <Route path="/comparativa-financiera" element={<VerComparativaFinanciera />} />
        <Route path="/simulaciones-por-modulo" element={<VerSimulacionesPorModulo />} />

        {/* Colaborador */}
        <Route path="/colaborador/oferta" element={<FormularioOferta />} />
        <Route path="/colaborador/ofertas" element={<VisualizacionOfertas />} />
        <Route path="/colaborador/historial" element={<VerHistorialOfertas />} />
        <Route path="/colaborador/ofertas-expiradas" element={<VerOfertasExpiradas />} />

        {/* Simuladores */}
        <Route path="/simulador-inversion" element={<SimuladorInversion />} />
        <Route path="/simulador-credito" element={<SimuladorCredito />} />
        <Route path="/ahorro-grupal" element={<AhorroGrupal />} />
        <Route path="/menu-simuladores" element={<MenuSimuladores />} />
        <Route path="/simulaciones" element={<VerSimulaciones />} />
        <Route path="/simulacion/:id" element={<DetalleSimulacion />} />

        {/* Red social y evaluación */}
        <Route path="/red-social" element={<RedSocialFinanciera />} />
        <Route path="/evaluacion" element={<EvaluacionSistema />} />

        {/* Usuario */}
        <Route path="/configuracion" element={<ConfiguracionUsuario />} />
        <Route path="/resumen" element={<ResumenFinanciero />} />
        <Route path="/mensajes" element={<MensajesSistema />} />
        <Route path="/actividad" element={<ActividadUsuario />} />
        <Route path="/feedback" element={<FeedbackUsuario />} />
        <Route path="/ingreso" element={<IngresoMensual />} />
        <Route path="/actividad-grupal" element={<VerActividadGrupal />} />

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2>404 - Página no encontrada</h2>
              <p>Verifica la ruta o vuelve al inicio.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
