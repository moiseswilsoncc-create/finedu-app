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

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#2c3e50",
      color: "white"
    }}>
      <div>
        {tipoUsuario === "usuario" && (
          <>
            <Link to="/usuario" style={{ color: "white", marginRight: "1rem" }}>👤 Usuario</Link>
            <Link to="/vista-grupal" style={{ color: "white", marginRight: "1rem" }}>👥 Grupo</Link>
          </>
        )}
        {tipoUsuario === "colaborador" && (
          <>
            <Link to="/panel-colaborador" style={{ color: "white", marginRight: "1rem" }}>🤝 Colaborador</Link>
          </>
        )}
        {tipoUsuario === "institucional" && (
          <>
            <Link to="/institucional" style={{ color: "white", marginRight: "1rem" }}>🏛️ Institucional</Link>
            <Link to="/informe-institucional" style={{ color: "white", marginRight: "1rem" }}>📄 Informe</Link>
          </>
        )}
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
