import React from "react";
import { useNavigate } from "react-router-dom";

const PanelColaboradores: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#3498db", marginBottom: "1rem" }}>🤝 Panel de colaboradores</h2>

      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", lineHeight: "1.6" }}>
        Bienvenido al espacio institucional de Finedu. Este panel está diseñado exclusivamente para que puedas publicar contenido útil para los usuarios, como ofertas de crédito, tasas preferenciales, cursos de finanzas o beneficios. 
        Toda la información que ingreses será visible para los usuarios en su panel bajo el bloque <strong>“📊 Datos y ofertas financieras”</strong>.
      </p>

      {/* Botón para publicar contenido institucional */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <button
          onClick={() => navigate("/ofertas-colaborador")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          📢 Publicar oferta o curso
        </button>
      </div>

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

      <div style={{ marginTop: "2rem", textAlign: "center", color: "#888", fontStyle: "italic" }}>
        Recuerda que los informes de métricas te llegarán directamente por correo. Este panel no permite visualizar datos internos ni fichas de usuarios.
      </div>
    </div>
  );
};

export default PanelColaboradores;
