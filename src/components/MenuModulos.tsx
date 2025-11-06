import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/MenuModulos.css";

// 📌 Lista de módulos visibles para USUARIOS
// 🔹 Se eliminaron módulos de colaboradores, institucionales y validación técnica
const todosLosModulos = [
  { ruta: "/panel-usuario", label: "👤 Panel del Usuario" },

  // Módulo central de finanzas
  { ruta: "/finanzas", label: "💵 Finanzas" },
  { ruta: "/finanzas/ingresos", label: "💰 Ingresos" },
  { ruta: "/finanzas/egresos", label: "💸 Egresos" },
  { ruta: "/finanzas/resumen", label: "📊 Resumen Financiero" },
  { ruta: "/finanzas/resumen-egresos", label: "📊 Resumen de Egresos" }, // 👈 Nuevo acceso
  { ruta: "/finanzas/creditos", label: "🏦 Simulador de Créditos" },
  { ruta: "/finanzas/foro", label: "💬 Foro Financiero" }, // 🔹 Nuevo módulo integrado

  // Otros módulos disponibles para usuarios
  { ruta: "/registro-ahorro", label: "💰 Registro de Ahorro" },
  { ruta: "/simulador-inversion", label: "📈 Simulador de Inversión" },
  { ruta: "/test-financiero", label: "🧠 Test Financiero" },

  // 🔹 Nuevo módulo oficial de Vista Grupal
  { ruta: "/vista-grupal", label: "👨‍👩‍👧‍👦 Vista Grupal" },

  { ruta: "/admin-grupo", label: "🛠️ Administración de Grupo" },
  { ruta: "/evaluador-credito", label: "🏦 Evaluador de Crédito Inteligente" },

  // 🔹 Usuarios sí pueden ver ofertas de colaboradores
  { ruta: "/panel-ofertas", label: "📢 Ofertas activas" },
  { ruta: "/datos-ofertas", label: "📢 Publicar oferta" }
];

const MenuModulos = () => {
  const correo = localStorage.getItem("correoUsuario");
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const [nuevasOfertas, setNuevasOfertas] = useState(0);
  const [modulosPermitidos, setModulosPermitidos] = useState<string[]>([]);

  useEffect(() => {
    const verificarPermisos = async () => {
      if (!correo) return;

      const { data, error } = await supabase
        .from("permisos_usuario")
        .select("modulo")
        .eq("usuario", correo)
        .eq("acceso", true);

      if (error) {
        console.error("Error al cargar permisos:", error.message);
        return;
      }

      const rutasPermitidas = data?.map((p) => p.modulo) || [];
      setModulosPermitidos(rutasPermitidas);
    };

    const verificarNovedades = async () => {
      if (!correo || tipoUsuario !== "usuario") return;

      const { data: vista } = await supabase
        .from("registro_visualizacion")
        .select("fecha_vista")
        .eq("usuario_id", correo)
        .eq("modulo", "DatosOfertas")
        .single();

      const { data: ofertas } = await supabase
        .from("ofertas_colaborador")
        .select("id, fecha_publicacion")
        .eq("visibilidad", true)
        .gt("fecha_expiracion", new Date().toISOString());

      if (vista && ofertas) {
        const nuevas = ofertas.filter(
          (o) => new Date(o.fecha_publicacion) > new Date(vista.fecha_vista)
        );
        setNuevasOfertas(nuevas.length);
      }
    };

    verificarPermisos();
    verificarNovedades();
  }, [correo, tipoUsuario]);

  const modulosFiltrados = todosLosModulos.filter((modulo) =>
    modulosPermitidos.includes(modulo.ruta)
  );

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
