import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // ✅ usar cliente centralizado
import { Colaborador } from "../types";

const PanelColaboradores: React.FC = () => {
  const navigate = useNavigate();
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [error, setError] = useState("");

  // ✅ usar la misma clave que guardamos en LoginColaborador
  const correo = localStorage.getItem("correoColaborador");

  useEffect(() => {
    const cargarColaborador = async () => {
      if (!correo) {
        setError("No se encontró el correo en la sesión.");
        return;
      }

      const { data, error: errorColaborador } = await supabase
        .from("colaboradores")
        .select("*")
        .eq("correo", correo)
        .single();

      if (errorColaborador || !data) {
        setError("No se pudo cargar la información del colaborador.");
        return;
      }

      setColaborador(data);
    };

    cargarColaborador();
  }, [correo]);

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#c0392b" }}>⚠️ Error</h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>{error}</p>
      </div>
    );
  }

  if (!colaborador) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#2980b9" }}>⏳ Cargando colaborador...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#3498db", marginBottom: "1rem" }}>🤝 Panel de colaboradores</h2>

      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", lineHeight: "1.6" }}>
        Bienvenido {colaborador.nombreResponsable || colaborador.nombre}{" "}
        {colaborador.apellido || ""} al espacio institucional de Finedu.  
        Este panel está diseñado para que publiques contenido útil para los usuarios: ofertas de crédito, tasas preferenciales, cursos de finanzas o beneficios.  
        Toda la información que ingreses será visible en el bloque <strong>“📊 Datos y ofertas financieras”</strong>.
      </p>

      <div style={{
        backgroundColor: "#ecf0f1",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "2rem"
      }}>
        <p><strong>Institución:</strong> {colaborador.institucion}</p>
        <p><strong>Ciudad:</strong> {colaborador.ciudad}</p>
        <p><strong>Área:</strong> {colaborador.area}</p>
        <p><strong>Rol:</strong> {colaborador.rol}</p>
        <p><strong>Estado de solicitud:</strong> {colaborador.estado}</p>
      </div>

      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <button
          onClick={() => navigate("/datos-ofertas")}
          style={buttonStyle("#27ae60")}
        >
          📢 Publicar datos y ofertas
        </button>
      </div>

      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <button
          onClick={() => navigate("/cambio-clave-colaborador")}
          style={buttonStyle("#e67e22")}
        >
          🔒 Cambiar mi clave
        </button>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center", color: "#888", fontStyle: "italic" }}>
        Recuerda que los informes de métricas te llegarán directamente por correo.  
        Este panel no permite visualizar datos internos ni fichas de usuarios.
      </div>
    </div>
  );
};

const buttonStyle = (bgColor: string) => ({
  padding: "0.6rem 1.2rem",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
});

export default PanelColaboradores;
