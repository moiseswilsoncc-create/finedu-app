import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { usePermisos } from "./hooks/usePermisos";
import { UserProvider, useUserPerfil } from "./context/UserContext";
import { GrupoProvider } from "./context/GrupoContext";

// 🧠 Importaciones de Componentes
import Bienvenida from "./components/Bienvenida";
import RegistroUsuario from "./components/RegistroUsuario";
import LoginUsuario from "./components/LoginUsuario";
import PanelUsuario from "./components/PanelUsuario";
import VistaErrorAcceso from "./components/VistaErrorAcceso";
import RecuperarClave from "./components/RecuperarClave";
import NuevaClave from "./components/NuevaClave";
import RegistroPendiente from "./components/RegistroPendiente";

// Finanzas
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

// Ahorro
import PanelAhorro from "./components/PanelAhorro";
import CrearGrupo from "./components/CrearGrupo";
// Si tienes DashboardDual, impórtalo y úsalo en la ruta /panel-ahorro
// import DashboardDual from "./components/DashboardDual"; 

// Colaboradores e Institucional
import RegistroColaborador from "./components/RegistroColaborador";
import IngresoColaborador from "./components/IngresoColaborador";
import LoginColaborador from "./components/LoginColaborador";
import PanelColaboradores from "./components/PanelColaboradores";
import InvitacionColaboradores from "./components/InvitacionColaboradores";
import OfertasColaboradores from "./components/OfertasColaboradores";
import PublicarOfertaColaborador from "./components/PublicarOfertaColaborador";
import DashboardInstitucional from "./institucional/DashboardInstitucional";
import EditorEstadoArchivos from "./institucional/EditorEstadoArchivos";
import EditorTrazabilidad from "./institucional/EditorTrazabilidad";
import MetricaSupabase from "./institucional/MetricaSupabase";
import TestInstitucional from "./institucional/TestInstitucional";
import MenuModulos from "./components/MenuModulos";
import Navbar from "./components/Navbar";
import VistaGrupal from "./components/VistaGrupal";
import Resumen from "./components/Resumen";
import EditarIngresosEgresos from "./components/EditarIngresosEgresos";
import EditarOferta from "./components/EditarOferta";
import VistaIngresoColaborador from "./components/VistaIngresoColaborador";

// 🔒 1. COMPONENTE UNIFICADO DE RUTA PROTEGIDA
const RutaProtegida: React.FC<{ children: React.ReactNode; rolRequerido?: string }> = ({ 
  children, 
  rolRequerido 
}) => {
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  
  useEffect(() => {
    const validar = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        setAutorizado(false);
        return;
      }

      // Si no requiere rol, solo valida login
      if (!rolRequerido) {
        setAutorizado(true);
        return;
      }

      // Validación de rol
      const rolUsuario = user.user_metadata?.rol;
      setAutorizado(rolUsuario === rolRequerido);
    };
    
    validar();
  }, [rolRequerido]);

  if (autorizado === null) {
    // Loader mientras valida permisos
    return <div className="flex justify-center p-10"><span className="text-blue-600 animate-pulse">🔐 Verificando accesos...</span></div>;
  }

  if (!autorizado) {
    if (rolRequerido === 'colaborador') return <Navigate to="/login-colaborador" replace />;
    return <Navigate to="/login-usuario" replace />;
  }

  return <>{children}</>;
};

// 🧠 2. CONTENIDO LÓGICO (SEPARADO PARA EVITAR PARADOJA DEL CONTEXTO)
const ContenidoApp: React.FC = () => {
  const location = useLocation();
  
  // ✅ AQUÍ SÍ PODEMOS USAR EL HOOK PORQUE ESTAMOS DENTRO DEL PROVIDER
  const { perfil, cargando: cargandoPerfil } = useUserPerfil();
  
  // Obtenemos el ID de forma segura
  const usuarioId = perfil?.id || null;
  
  // Hook de permisos
  const { modulos, cargando: cargandoPermisos } = usePermisos(usuarioId);

  const rutasPublicas = [
    "/", "/login-usuario", "/registro-usuario", "/registro-pendiente",
    "/error-acceso", "/recuperar-clave", "/nueva-clave",
    "/login-colaborador", "/registro-colaborador", "/ingreso-colaborador"
  ];
  const mostrarNavbar = !rutasPublicas.includes(location.pathname);

  // 🚦 BLINDAJE CONTRA PANTALLA BLANCA
  // Si el perfil está cargando, mostramos un loader global en vez de romper la UI
  if (cargandoPerfil) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-bold text-gray-700 mb-2">Finedu</div>
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 text-sm">Cargando entorno seguro...</p>
      </div>
    );
  }

  return (
    <>
      {mostrarNavbar && <Navbar />}
      {mostrarNavbar && <MenuModulos />}
      
      <Routes>
        {/* PÚBLICAS */}
        <Route path="/" element={<Bienvenida />} />
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        <Route path="/registro-pendiente" element={<RegistroPendiente />} />
        <Route path="/error-acceso" element={<VistaErrorAcceso />} />
        <Route path="/recuperar-clave" element={<RecuperarClave />} />
        <Route path="/nueva-clave" element={<NuevaClave />} />

        {/* PANEL USUARIO */}
        {modulos.includes("panel-usuario") && (
          <Route path="/panel-usuario" element={<RutaProtegida><PanelUsuario /></RutaProtegida>} />
        )}

        {/* FINANZAS */}
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
            <Route path="/resumen" element={<RutaProtegida><Resumen /></RutaProtegida>} />
            <Route path="/editar-ingresos-egresos" element={<RutaProtegida><EditarIngresosEgresos /></RutaProtegida>} />
          </>
        )}

        {/* AHORRO */}
        {modulos.includes("panel-ahorro") && (
          <>
            <Route path="/panel-ahorro" element={<RutaProtegida><PanelAhorro /></RutaProtegida>} />
            <Route path="/crear-grupo" element={<RutaProtegida><CrearGrupo /></RutaProtegida>} />
            <Route path="/panel-grupo" element={<RutaProtegida><PanelAhorro /></RutaProtegida>} />
          </>
        )}

        {/* VISTA GRUPAL */}
        {modulos.includes("vista-grupal") && (
          <Route path="/vista-grupal" element={<RutaProtegida><VistaGrupal nombreGrupoMeta="" metaGrupal={0} participantes={[]} /></RutaProtegida>} />
        )}

        {/* COLABORADORES */}
        <Route path="/registro-colaborador" element={<RegistroColaborador />} />
        <Route path="/ingreso-colaborador" element={<IngresoColaborador />} />
        <Route path="/login-colaborador" element={<LoginColaborador />} />
        <Route path="/panel-colaboradores" element={<RutaProtegida rolRequerido="colaborador"><PanelColaboradores /></RutaProtegida>} />
        <Route path="/invitacion-colaboradores" element={<RutaProtegida rolRequerido="colaborador"><InvitacionColaboradores /></RutaProtegida>} />
        <Route path="/ofertas-colaboradores" element={<RutaProtegida rolRequerido="colaborador"><OfertasColaboradores /></RutaProtegida>} />
        <Route path="/publicar-oferta-colaborador" element={<RutaProtegida rolRequerido="colaborador"><PublicarOfertaColaborador /></RutaProtegida>} />
        <Route path="/datos-ofertas" element={<RutaProtegida rolRequerido="colaborador"><OfertasColaboradores /></RutaProtegida>} />
        <Route path="/editar-oferta" element={<RutaProtegida rolRequerido="colaborador"><EditarOferta /></RutaProtegida>} />
        <Route path="/vista-ingreso-colaborador" element={<RutaProtegida rolRequerido="colaborador"><VistaIngresoColaborador /></RutaProtegida>} />

        {/* INSTITUCIONAL */}
        <Route path="/dashboard-institucional" element={<RutaProtegida rolRequerido="admin"><DashboardInstitucional /></RutaProtegida>} />
        <Route path="/editor-estado" element={<RutaProtegida rolRequerido="admin"><EditorEstadoArchivos /></RutaProtegida>} />
        <Route path="/editor-trazabilidad" element={<RutaProtegida rolRequerido="admin"><EditorTrazabilidad /></RutaProtegida>} />
        <Route path="/metrica-supabase" element={<RutaProtegida rolRequerido="admin"><MetricaSupabase /></RutaProtegida>} />
        <Route path="/test-institucional" element={<RutaProtegida rolRequerido="admin"><TestInstitucional /></RutaProtegida>} />

        <Route path="/menu-modulos" element={<MenuModulos />} />
      </Routes>
    </>
  );
};

// 🚀 3. APP RAÍZ (PROVEEDOR)
// Esta es la estructura correcta: El Proveedor envuelve al Contenido
const App: React.FC = () => {
  return (
    <UserProvider>
      <GrupoProvider>
        <ContenidoApp />
      </GrupoProvider>
    </UserProvider>
  );
};

export default App;
