import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/MenuModulos.css";

// 📌 Lista de módulos visibles para USUARIOS
const todosLosModulos = [
  { ruta: "/panel-usuario", label: "👤 Panel del Usuario" },

  // Finanzas: botones separados
  { ruta: "/finanzas/ingresos", label: "💰 Ingresos" },
  { ruta: "/finanzas/egresos", label: "💸 Egresos" },
  { ruta: "/finanzas/resumen", label: "📊 Resumen Financiero" },
  { ruta: "/finanzas/resumen-egresos", label: "📊 Resumen de Egresos" },
  { ruta: "/finanzas/creditos", label: "🏦 Simulador de Créditos" },
  { ruta: "/finanzas/foro", label: "💬 Foro Financiero" },

  // Otros módulos disponibles para usuarios
  { ruta: "/registro-ahorro", label: "💰 Registro de Ahorro" },
  { ruta: "/simulador-inversion", label: "📈 Simulador de Inversión" },
  { ruta: "/test-financiero", label: "🧠 Test Financiero" },

  { ruta: "/vista-grupal", label: "👨‍👩‍👧‍👦 Vista Grupal" },
  { ruta: "/admin-grupo", label: "🛠️ Administración de Grupo" },
  { ruta: "/evaluador-credito", label: "🏦 Evaluador de Crédito Inteligente" },

  { ruta: "/panel-ofertas", label: "📢 Ofertas activas" },
  { ruta: "/datos-ofertas", label: "📢 Publicar oferta" }
];

const MenuModulos = () => {
  const usuarioId = localStorage.getItem("usuarioId"); // UUID del usuario autenticado
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const [nuevasOfertas, setNuevasOfertas] = useState(0);
  const [modulosPermitidos, setModulosPermitidos] = useState<string[]>([]);

  useEffect(() => {
    const verificarPermisos = async () => {
      if (!usuarioId) return;

      const { data, error } = await supabase
        .from("permisos_usuario")
        .select("modulo")
        .eq("usuario_id", usuarioId)
        .eq("permiso", "true");

      if (error) {
        console.error("Error al cargar permisos:", error.message);
        setModulosPermitidos([]); // evitar pantalla en blanco
        return;
      }

      const rutasPermitidas = data?.map((p) => p.modulo) || [];
      setModulosPermitidos(rutasPermitidas);
    };

    const verificarNovedades = async () => {
      if (!usuarioId || tipoUsuario !== "usuario") return;

      const { data: vista } = await supabase
        .from("registro_visualizacion")
        .select("fecha_vista")
        .eq("usuario_id", usuarioId)
        .eq("modulo", "DatosOfertas")
        .single();

      const { data: ofertas } = await supabase
        .from("ofertas_colaboradores")
        .select("id, fecha_invitacion")
        .eq("visibilidad", true)
        .gt("expira", new Date().toISOString());

      if (vista && ofertas) {
        const nuevas = ofertas.filter(
          (o) => new Date(o.fecha_invitacion) > new Date(vista.fecha_vista)
        );
        setNuevasOfertas(nuevas.length);
      }
    };

    verificarPermisos();
    verificarNovedades();
  }, [usuarioId, tipoUsuario]);

  // 🔑 Ajuste: Ingresos y Egresos siempre visibles
  const modulosFiltrados = todosLosModulos.filter((modulo) => {
    if (modulo.ruta === "/finanzas/ingresos" || modulo.ruta === "/finanzas/egresos") {
      return true; // siempre mostrar estos dos
    }
    return modulosPermitidos.includes(modulo.ruta);
  });

  return (
    <div className="menu-modulos-container">
      <h2>📂 Accede a tus módulos</h2>
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
    </div>
  );
};

export default MenuModulos;
