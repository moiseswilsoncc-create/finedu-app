import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

interface Props {
  tipoUsuario: "usuario" | "colaborador" | "institucional" | null;
  onCerrarSesion: () => void;
}

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

const Navbar: React.FC<Props> = ({ tipoUsuario, onCerrarSesion }) => {
  const location = useLocation();
  const [enlacesPermitidos, setEnlacesPermitidos] = useState<string[]>([]);
  const nombreUsuario = localStorage.getItem("nombreUsuario") || "";
  const correo = localStorage.getItem("correoUsuario");

  const capitalizarNombre = (nombre: string) =>
    nombre
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");

  useEffect(() => {
    const cargarPermisos = async () => {
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

      const rutas = data?.map((p) => p.modulo) || [];
      setEnlacesPermitidos(rutas);
    };

    cargarPermisos();
  }, [correo]);

  if (!tipoUsuario) return null;

  const todosLosEnlaces: Record<string, { ruta: string; label: string }[]> = {
    usuario: [
      { ruta: "/usuario", label: "👤 Usuario" },
      { ruta: "/vista-grupal", label: "👥 Grupo" },
      { ruta: "/panel-ofertas", label: "📢 Ofertas" },
      { ruta: "/resumen", label: "📊 Resumen" }
    ],
    colaborador: [
      { ruta: "/panel-colaborador", label: "🤝 Panel colaborador" },
      { ruta: "/datos-ofertas", label: "📢 Publicar oferta" },
      { ruta: "/registro-colaborador", label: "🧑‍💼 Registro colaborador" }
    ],
    institucional: [
      { ruta: "/institucional", label: "🏛️ Dashboard institucional" },
      { ruta: "/informe-institucional", label: "📄 Informe" },
      { ruta: "/panel-colaboradores", label: "🧑‍💼 Colaboradores" },
      { ruta: "/validacion-pre-vercel", label: "✅ Validación final" }
    ]
  };

  const enlacesFiltrados =
    todosLosEnlaces[tipoUsuario]?.filter((enlace) =>
      enlacesPermitidos.includes(enlace.ruta)
    ) || [];

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#2c3e50",
        color: "white"
      }}
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo-finedu.png"
          alt="Logo Finedu"
          style={{ height: "40px", marginRight: "1rem" }}
        />
        {enlacesFiltrados.map((enlace, index) => (
          <Link
            key={index}
            to={enlace.ruta}
            style={{
              color: location.pathname === enlace.ruta ? "#f1c40f" : "white",
              marginRight: "1rem",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            {enlace.label}
          </Link>
        ))}

        {/* 🔑 Botón fijo solo para pruebas */}
        <Link
          to="/invitacion-colaboradores"
          style={{
            color:
              location.pathname === "/invitacion-colaboradores"
                ? "#f1c40f"
                : "white",
            marginRight: "1rem",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          📨 Invitación (test)
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {nombreUsuario && (
          <span style={{ fontSize: "0.95rem", color: "#ecf0f1" }}>
            Bienvenido, <strong>{capitalizarNombre(nombreUsuario)}</strong>
          </span>
        )}
        <button
          onClick={onCerrarSesion}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
