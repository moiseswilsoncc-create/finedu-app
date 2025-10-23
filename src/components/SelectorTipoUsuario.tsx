import React from "react";
import { useLocation } from "react-router-dom";

interface Props {
  setTipoUsuario: (tipo: "usuario" | "colaborador" | "institucional") => void;
}

const SelectorTipoUsuario: React.FC<Props> = ({ setTipoUsuario }) => {
  const location = useLocation();

  // Mostrar solo en la página de inicio
  if (location.pathname !== "/") return null;

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <button
        onClick={() => {
          setTipoUsuario("usuario");
          localStorage.setItem("tipoUsuario", "usuario");
        }}
        style={{ margin: "0.5rem" }}
      >
        👤 Ingresar como usuario
      </button>

      <button
        onClick={() => {
          setTipoUsuario("colaborador");
          localStorage.setItem("tipoUsuario", "colaborador");
        }}
        style={{ margin: "0.5rem" }}
      >
        🤝 Ingresar como colaborador
      </button>

      <button
        onClick={() => {
          setTipoUsuario("institucional");
          localStorage.setItem("tipoUsuario", "institucional");
        }}
        style={{ margin: "0.5rem" }}
      >
        🏛️ Vista institucional
      </button>
    </div>
  );
};

export default SelectorTipoUsuario;
