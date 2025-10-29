import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "../styles/MenuModulos.css";

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

const todosLosModulos = [
  { ruta: "/panel-usuario", label: "👤 Panel del Usuario" },
  { ruta: "/registro-ahorro", label: "💰 Registro de Ahorro" },
  { ruta: "/simulador-inversion", label: "📈 Simulador de Inversión" },
  { ruta: "/test-financiero", label: "🧠 Test Financiero" },
  { ruta: "/resumen-financiero", label: "📊 Resumen Financiero" },
  { ruta: "/vista-grupal", label: "👨‍👩‍👧‍👦 Vista Grupal" },
  { ruta: "/admin-grupo", label: "🛠️ Administración de Grupo" },
  { ruta: "/evaluador-credito", label: "🏦 Evaluador de Crédito Inteligente" },
  { ruta: "/panel-ofertas", label: "📢 Ofertas activas" },
  { ruta: "/panel-colaboradores", label: "🧑‍💼 Panel del Colaborador" },
  { ruta: "/datos-ofertas", label: "📢 Publicar oferta" },
  { ruta: "/registro-colaborador", label: "🧑‍💼 Registro colaborador" },
  { ruta: "/institucional", label: "🏛️ Dashboard institucional" },
  { ruta: "/informe-institucional", label: "📄 Informe" },
  { ruta: "/validacion-pre-vercel", label: "✅ Validación final" }
];

const MenuModulos = () => {
  const navigate = useNavigate();
  const logueado = localStorage.getItem("logueado") === "true";
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const correo = localStorage.getItem("correoUsuario");
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
        const nuevas = ofertas.filter((o) =>
          new Date(o.fecha_publicacion) > new Date(vista.fecha_vista)
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
