import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  setTipoUsuario: (tipo: "usuario" | "colaborador" | "institucional") => void;
  tipoUsuarioActual: "usuario" | "colaborador" | "institucional" | null;
}

const SelectorTipoUsuario: React.FC<Props> = ({ setTipoUsuario, tipoUsuarioActual }) => {
  const location = useLocation();

  // Mostrar solo en la página de inicio
  if (location.pathname !== "/") return null;

  // Persistencia local (temporal) y preparación para trazabilidad global
  const seleccionarTipo = (tipo: "usuario" | "colaborador" | "institucional") => {
    setTipoUsuario(tipo);
    localStorage.setItem("tipoUsuario", tipo); // 🔄 Reemplazar por contexto global o Supabase en el futuro

    // 🔐 Validación futura en backend Express:
    // Enviar tipoUsuario al backend para validar acceso a rutas protegidas
    // Ejemplo: POST /validar-rol con { tipoUsuario: tipo, token: usuarioToken }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h4>Selecciona tu tipo de acceso</h4>

      <button onClick={() => seleccionarTipo("usuario")} style={{ margin: "0.5rem" }}>
        👤 Ingresar como usuario
      </button>

      <button onClick={() => seleccionarTipo("colaborador")} style={{ margin: "0.5rem" }}>
        🤝 Ingresar como colaborador
      </button>

      <button onClick={() => seleccionarTipo("institucional")} style={{ margin: "0.5rem" }}>
        🏛️ Vista institucional
      </button>

      {/* 📊 Mostrar tipo de usuario actual como parte de la identidad del sistema */}
      {tipoUsuarioActual && (
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Acceso seleccionado: <strong>{tipoUsuarioActual}</strong>
        </p>
      )}
    </div>
  );
};

export default SelectorTipoUsuario;
