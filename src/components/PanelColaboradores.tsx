import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  pais: string;
}

const PanelColaboradores: React.FC<Props> = ({ pais }) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "#3498db", marginBottom: "1rem" }}>📊 Panel de colaboradores</h2>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
        Bienvenido al espacio institucional de Finedu. Aquí puedes visualizar el impacto de tus grupos, generar reportes y acompañar a tus usuarios.
      </p>

      {/* Botón para cambiar clave */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <button
          onClick={() => navigate("/cambio-clave-colaborador")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#e67e22",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔒 Cambiar mi clave
        </button>
      </div>

      {/* Aquí puedes agregar más módulos o métricas colaborativas */}
      <div style={{ marginTop: "2rem" }}>
        <p style={{ fontStyle: "italic", color: "#888" }}>
          Próximamente: métricas de impacto, seguimiento de usuarios y reportes personalizados.
        </p>
      </div>
    </div>
  );
};

export default PanelColaboradores;
