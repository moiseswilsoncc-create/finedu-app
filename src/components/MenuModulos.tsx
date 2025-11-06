import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/MenuModulos.css";

// 📌 Lista única de módulos visibles para USUARIOS
const todosLosModulos = [
  { ruta: "/panel-usuario", label: "👤 Panel del Usuario" },

  // Finanzas
  { ruta: "/finanzas", label: "💵 Flujo Financiero" },
  { ruta: "/finanzas/ingresos", label: "💰 Ingresos" },
  { ruta: "/finanzas/egresos", label: "💸 Egresos" },
  { ruta: "/finanzas/resumen", label: "📊 Resumen Financiero" },
  { ruta: "/finanzas/resumen-egresos", label: "📊 Resumen de Egresos" },
  { ruta: "/finanzas/creditos", label: "🏦 Simulador de Créditos" },
  { ruta: "/evaluador-credito", label: "🏦 Evaluador de Crédito Inteligente" },
  { ruta: "/finanzas/foro", label: "💬 Foro Financiero" },

  // Ahorro e inversión
  { ruta: "/registro-ahorro", label: "💰 Registro de Ahorro" },
  { ruta: "/simulador-inversion", label: "📈 Simulador de Inversión" },

  // Social
  { ruta: "/vista-grupal", label: "👨‍👩‍👧‍👦 Vista Grupal" },
  { ruta: "/admin-grupo", label: "🛠️ Administración de Grupo" },

  // Ofertas
  { ruta: "/panel-ofertas", label: "📢 Ofertas activas" },
  { ruta: "/datos-ofertas", label: "📢 Publicar oferta" },

  // Test
  { ruta: "/test-financiero", label: "🧠 Test Financiero" },
];

const MenuModulos = () => {
  const usuarioId = localStorage.getItem("usuarioId"); // UUID del usuario autenticado
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  const [nuevasOfertas, setNuevasOfertas] = useState(0);
  const [modulosPermitidos, setModulosPermitidos] = useState<string[] | null>(null);

  useEffect(() => {
    const verificarPermisos = async () => {
      try {
        if (!usuarioId) {
          // Fallback: mostrar todos los módulos
          setModulosPermitidos(todosLosModulos.map(m => m.ruta));
          return;
        }

        const { data, error } = await supabase
          .from("permisos_usuario")
          .select("modulo, permiso")
          .eq("usuario_id", usuarioId);

        if (error) {
          console.error("Error al cargar permisos:", error.message);
          setModulosPermitidos(todosLosModulos.map(m => m.ruta));
          return;
        }

        const rutasHabilitadas = (data || [])
          .filter((p: any) => String(p.permiso).toLowerCase() === "true")
          .map((p: any) => p.modulo);

        const dedup = Array.from(new Set(rutasHabilitadas));
        setModulosPermitidos(
          dedup.length > 0 ? dedup : todosLosModulos.map(m => m.ruta)
        );
      } catch (e: any) {
        console.error("Excepción verificando permisos:", e?.message || e);
        setModulosPermitidos(todosLosModulos.map(m => m.ruta));
      }
    };

    const verificarNovedades = async () => {
      try {
        if (!usuarioId || tipoUsuario !== "usuario") {
          setNuevasOfertas(0);
          return;
        }

        const { data: vista } = await supabase
          .from("registro_visualizacion")
          .select("fecha_vista")
          .eq("usuario_id", usuarioId)
          .eq("modulo", "DatosOfertas")
          .maybeSingle();

        const { data: ofertas } = await supabase
          .from("ofertas_colaborador")
          .select("id, fecha_publicacion")
          .eq("visibilidad", true)
          .gt("fecha_expiracion", new Date().toISOString());

        if (vista && ofertas) {
          const nuevas = ofertas.filter(
            (o: any) => new Date(o.fecha_publicacion) > new Date(vista.fecha_vista)
          );
          setNuevasOfertas(nuevas.length);
        } else {
          setNuevasOfertas(0);
        }
      } catch (e: any) {
        console.warn("Aviso novedades:", e?.message || e);
        setNuevasOfertas(0);
      }
    };

    verificarPermisos();
    verificarNovedades();
  }, [usuarioId, tipoUsuario]);

  if (modulosPermitidos === null) {
    return (
      <div className="menu-modulos-container">
        <h2>📂 Accede a tus módulos</h2>
        <p>Cargando módulos...</p>
      </div>
    );
  }

  const permitidosSet = new Set(modulosPermitidos);
  const modulosFiltrados = todosLosModulos.filter(m => permitidosSet.has(m.ruta));

  return (
    <div className="menu-modulos-container">
      <h2>📂 Accede a tus módulos</h2>
      {modulosFiltrados.length === 0 ? (
        <p>⚠️ No tienes módulos habilitados aún.</p>
      ) : (
        <div className="modulo-grid">
          {modulosFiltrados.map((modulo, index) => (
            <Link key={index} to={modulo.ruta} className="btn-modulo">
              {modulo.label}
              {modulo.ruta === "/panel-ofertas" && nuevasOfertas > 0 && (
                <span className="badge-campana">{nuevasOfertas}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuModulos;
