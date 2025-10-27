import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "../styles/MenuModulos.css";

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

const modulosUsuario = [
  { ruta: "/panel-usuario", label: "👤 Panel del Usuario" },
  { ruta: "/registro-ahorro", label: "💰 Registro de Ahorro" },
  { ruta: "/simulador-inversion", label: "📈 Simulador de Inversión" },
  { ruta: "/test-financiero", label: "🧠 Test Financiero" },
  { ruta: "/resumen-financiero", label: "📊 Resumen Financiero" },
  { ruta: "/vista-grupal", label: "👨‍👩‍👧‍👦 Vista Grupal" },
  { ruta: "/admin-grupo", label: "🛠️ Administración de Grupo" },
  { ruta: "/evaluador-credito", label: "🏦 Evaluador de Crédito Inteligente" },
  { ruta: "/datos-ofertas", label: "📊 Datos y ofertas" } // ← módulo con campana
];

const modulosColaborador = [
  { ruta: "/panel-colaboradores", label: "🧑‍💼 Panel del Colaborador" },
  { ruta: "/admin-grupo", label: "🛠️ Administración de Grupo" },
  { ruta: "/vista-grupal", label: "👥 Vista Grupal Institucional" },
  { ruta: "/resumen-financiero", label: "📊 Reportes Financieros" }
];

const MenuModulos = () => {
  const navigate = useNavigate();
  const logueado = localStorage.getItem("logueado") === "true";
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const correo = localStorage.getItem("correoUsuario");
  const [nuevasOfertas, setNuevasOfertas] = useState(0);

  useEffect(() => {
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
        .eq("visible", true)
        .gt("fecha_expiracion", new Date().toISOString());

      if (vista && ofertas) {
        const nuevas = ofertas.filter((o) =>
          new Date(o.fecha_publicacion) > new Date(vista.fecha_vista)
        );
        setNuevasOfertas(nuevas.length);
      }
    };

    verificarNovedades();
  }, [correo, tipoUsuario]);

  const modulos = tipoUsuario === "colaborador" ? modulosColaborador : modulosUsuario;

  return (
    <div className="menu-modulos-container">
      <h2>📂 Accede a tus módulos</h2>
      <div className="modulo-grid">
        {modulos.map((modulo, index) => (
          <Link key={index} to={modulo.ruta} className="btn-modulo">
            {modulo.label}
            {modulo.ruta === "/datos-ofertas" && nuevasOfertas > 0 && (
              <span className="badge-campana">{nuevasOfertas}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuModulos;
