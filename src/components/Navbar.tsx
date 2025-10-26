import React from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  tipoUsuario: "usuario" | "colaborador" | "institucional" | null;
  onCerrarSesion: () => void;
}

const Navbar: React.FC<Props> = ({ tipoUsuario, onCerrarSesion }) => {
  const location = useLocation();
  if (!tipoUsuario) return null;

  const nombreUsuario = localStorage.getItem("nombreUsuario") || "";

  const capitalizarNombre = (nombre: string) =>
    nombre
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");

  // Logo institucional
  const logoFinedu = (
    <img
      src="/logo-finedu.png"
      alt="Logo Finedu"
      style={{ height: "40px", marginRight: "1rem" }}
    />
  );

  // Enlaces por tipo de usuario
  const enlaces: Record<string, { ruta: string; label: string }[]> = {
    usuario: [
      { ruta: "/usuario", label: "👤 Usuario" },
      { ruta: "/vista-grupal", label: "👥 Grupo" }
    ],
    colaborador: [
      { ruta: "/panel-colaborador", label: "🤝 Colaborador" }
    ],
    institucional: [
      { ruta: "/institucional", label: "🏛️ Institucional" },
      { ruta: "/informe-institucional", label: "📄 Informe" }
    ]
  };

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
        {logoFinedu}
        {enlaces[tipoUsuario]?.map((enlace, index) => (
          <Link
            key={index}
            to={enlace.ruta}
            style={{ color: "white", marginRight: "1rem" }}
          >
            {enlace.label}
          </Link>
        ))}
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
