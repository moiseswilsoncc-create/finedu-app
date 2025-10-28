import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Colaborador } from "../types";

const supabaseUrl = "https://ftsbnorudtcyrrubutt.supabase.co";
const supabaseKey = "TU_API_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const PanelColaboradores: React.FC = () => {
  const navigate = useNavigate();
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [error, setError] = useState("");

  const correo = localStorage.getItem("correo");

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
        Bienvenido {colaborador.nombre} {colaborador.apellido} al espacio institucional de Finedu. Este panel está diseñado exclusivamente para que puedas publicar contenido útil para los usuarios, como ofertas de crédito, tasas preferenciales, cursos de finanzas o beneficios. 
        Toda la información que ingreses será visible para los usuarios en su panel bajo el bloque <strong>“📊 Datos y ofertas financieras”</strong>.
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

      {/* Botón para publicar contenido institucional */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <button
          onClick={() => navigate("/datos-ofertas")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          📢 Publicar datos y ofertas
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
