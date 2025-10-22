import React from "react";

interface Props {
  setTipoUsuario: (tipo: "usuario" | "colaborador" | "institucional") => void;
}

const SelectorTipoUsuario: React.FC<Props> = ({ setTipoUsuario }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <button onClick={() => {
        setTipoUsuario("usuario");
        localStorage.setItem("tipoUsuario", "usuario");
      }}>
        Ingresar como usuario
      </button>

      <button onClick={() => {
        setTipoUsuario("colaborador");
        localStorage.setItem("tipoUsuario", "colaborador");
      }}>
        Ingresar como colaborador
      </button>

      <button onClick={() => {
        setTipoUsuario("institucional");
        localStorage.setItem("tipoUsuario", "institucional");
      }}>
        Vista institucional
      </button>
    </div>
  );
};

export default SelectorTipoUsuario;
