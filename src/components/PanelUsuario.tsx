// src/components/PanelUsuario.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AsistenteFinanciero from "./AsistenteFinanciero";
import { supabase } from "../supabaseClient";
import { OfertaColaborador } from "../types";

type Permiso = { modulo: string; permiso: string };

const PanelUsuario: React.FC = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("Usuario");
  const [correo, setCorreo] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [ofertasFiltradas, setOfertasFiltradas] = useState<OfertaColaborador[]>([]);
  const [permisos, setPermisos] = useState<Permiso[] | null>(null);

  // 📌 Módulos disponibles para el usuario
  const modulos = [
    { nombre: "💸 Ingresos y Egresos", ruta: "/finanzas", color: "#f39c12" },
    { nombre: "💰 Registro de Ahorro", ruta: "/registro-ahorro", color: "#27ae60" },
    { nombre: "👥 Mi Grupo", ruta: "/mi-grupo", color: "#2980b9" },
    { nombre: "🤝 Vista Grupal", ruta: "/vista-grupal", color: "#1abc9c" },
    { nombre: "📈 Simulador de Inversión", ruta: "/simulador-inversion", color: "#8e44ad" },
    { nombre: "🏦 Simulador de Crédito", ruta: "/finanzas/creditos", color: "#c0392b" }, // ✅ corregido
    { nombre: "🧠 Test Financiero", ruta: "/test-financiero", color: "#16a085" },
    { nombre: "📊 Mi Progreso", ruta: "/vista-etapa", color: "#34495e" },
    { nombre: "🗣️ Foro Financiero", ruta: "/finanzas/foro", color: "#2c3e50" } // ✅ corregido
  ];

  // ✅ Validar sesión con Supabase Auth
  useEffect(() => {
    const validarSesion = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate("/login-usuario"); // ruta oficial
        return;
      }

      setCorreo(data.user.email ?? null);
      setUsuarioId(data.user.id);

      // Traer datos extra desde tabla usuarios
      const { data: usuarioExtra } = await supabase
        .from("usuarios")
        .select("nombre, apellido")
        .eq("id", data.user.id)
        .single();

      if (usuarioExtra) {
        setNombreUsuario(`${usuarioExtra.nombre} ${usuarioExtra.apellido}`);
        localStorage.setItem("nombreUsuario", `${usuarioExtra.nombre} ${usuarioExtra.apellido}`);
      } else {
        setNombreUsuario(data.user.email?.split("@")[0] || "Usuario");
      }

      // ✅ Cargar permisos del usuario
      const { data: permisosData, error: permisosError } = await supabase
        .from("permisos_usuario")
        .select("modulo, permiso")
        .eq("usuario_id", data.user.id)
        .eq("permiso", "acceso");

      if (permisosError) {
        console.error("❌ Error al cargar permisos:", permisosError.message);
        setPermisos([]);
      } else {
        setPermisos(permisosData || []);
      }
    };

    validarSesion();
  }, [navigate]);
  // ✅ Obtener ofertas personalizadas
  useEffect(() => {
    const obtenerOfertas = async () => {
      if (!usuarioId) return;

      const { data: visualizacion, error: visError } = await supabase
        .from("registro_visualizacion")
        .select("fecha_vista")
        .eq("usuario_id", usuarioId)
        .eq("modulo", "DatosOfertas")
        .maybeSingle();

      if (visError && visError.code !== "PGRST116") {
        console.error("❌ Error cargando registro_visualizacion:", visError.message);
      }

      const { data: ofertas, error: ofertasError } = await supabase
        .from("ofertas_colaborador")
        .select("*")
        .eq("visible", true)
        .gt("fecha_expiracion", new Date().toISOString());

      if (ofertasError) {
        console.error("❌ Error cargando ofertas:", ofertasError.message);
        setOfertasFiltradas([]);
        return;
      }

      const nuevas = visualizacion
        ? ofertas.filter(o => new Date(o.fecha_publicacion) > new Date(visualizacion.fecha_vista))
        : ofertas;

      setOfertasFiltradas(nuevas || []);
    };

    obtenerOfertas();
  }, [usuarioId]);

  const evaluarSaludFinanciera = () => {
    const ahorro = parseInt(localStorage.getItem("ahorro") || "0");
    const cumplimiento = parseFloat(localStorage.getItem("cumplimiento") || "0");

    if (ahorro === 0 && cumplimiento === 0) {
      return {
        mensaje: "Aún no has ingresado tus datos financieros. ¡Estás a tiempo de comenzar tu camino hacia la autonomía! 🚀",
        emoji: "🕊️"
      };
    }

    if (cumplimiento >= 90) return { mensaje: "Tu salud financiera es excelente", emoji: "😊" };
    if (cumplimiento >= 70) return { mensaje: "Tu salud financiera es buena", emoji: "🙂" };
    if (cumplimiento >= 50) return { mensaje: "Tu salud financiera es regular", emoji: "😐" };
    return { mensaje: "Tu salud financiera necesita atención", emoji: "😕" };
  };

  const estadoFinanciero = evaluarSaludFinanciera();

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#3498db", marginBottom: "1rem" }}>👋 Bienvenido, {nombreUsuario}</h1>

      {permisos === null && <p>⏳ Cargando permisos…</p>}
      {permisos && permisos.length === 0 && <p>⚠️ No tienes módulos habilitados aún.</p>}

      <section style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h3>📊 Estado financiero actual</h3>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          {estadoFinanciero.emoji} {estadoFinanciero.mensaje}
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>📂 Módulos disponibles</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem"
        }}>
          {modulos.map((modulo, index) => (
            <button
              key={index}
              onClick={() => navigate(modulo.ruta)}
              style={{
                padding: "1rem",
                backgroundColor: modulo.color,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer"
              }}
            >
              {modulo.nombre}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>🤖 Asistente Financiero</h2>
        <AsistenteFinanciero />
      </section>

      {ofertasFiltradas.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <h2>📊 Datos y ofertas financieras</h2>
          {ofertasFiltradas.map((oferta, index) => (
            <div key={index} style={{
              backgroundColor: "#f9f9f9",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>
              <strong>{oferta.titulo}</strong> — {oferta.tipo} ({oferta.pais})
              <p>{oferta.descripcion}</p>
              <small>Válido hasta: {oferta.fecha_expiracion}</small>
            </div>
          ))}
        </section>
      )}

      <section>
        <Link to="/modulos" style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2ecc71",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none"
        }}>
          📁 Ver todos los módulos
        </Link>
      </section>
    </div>
  );
};

export default PanelUsuario;
