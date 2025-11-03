// src/components/PanelColaboradores.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Colaborador } from "../types";

interface Oferta {
  id: string;
  correo: string;
  institucion: string | null;
  rol: string | null;
  fecha_invitacion: string | null;
  expira: string | null;
}

const PanelColaboradores: React.FC = () => {
  const navigate = useNavigate();
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const correo = localStorage.getItem("correoColaborador");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!correo) {
          setError("No se encontró el correo en la sesión.");
          setLoading(false);
          return;
        }

        // 🔹 Cargar colaborador
        const { data: dataColab, error: errorColab } = await supabase
          .from("colaboradores")
          .select("*")
          .eq("correo", correo)
          .single();

        if (errorColab || !dataColab) {
          setError("No se pudo cargar la información del colaborador.");
          setLoading(false);
          return;
        }
        setColaborador(dataColab);

        // 🔹 Cargar ofertas del colaborador
        const { data: dataOfertas, error: errorOfertas } = await supabase
          .from("ofertas_colaborador")
          .select("*")
          .eq("correo", correo);

        if (errorOfertas) {
          console.error("Error cargando ofertas:", errorOfertas.message);
        } else {
          setOfertas(dataOfertas || []);
        }
      } catch (err: any) {
        console.error("Error inesperado:", err);
        setError("⚠️ Error inesperado al cargar datos.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [correo]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#2980b9" }}>⏳ Cargando datos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#c0392b" }}>⚠️ Error</h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>{error}</p>
      </div>
    );
  }

  if (!colaborador) {
    return null; // nunca debería pasar, pero evita pantalla en blanco
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#3498db", marginBottom: "1rem" }}>🤝 Panel de colaboradores</h2>

      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", lineHeight: "1.6" }}>
        Bienvenido {colaborador.nombreResponsable || colaborador.nombre}{" "}
        {colaborador.apellido || ""} al espacio institucional de Finedu.  
        Aquí puedes publicar y revisar tus ofertas activas.
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
          📢 Publicar nueva oferta
        </button>
      </div>

      <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>📊 Tus ofertas publicadas</h3>
      {ofertas.length === 0 ? (
        <p style={{ color: "#7f8c8d" }}>Aún no has publicado ninguna oferta.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {ofertas.map((oferta) => (
            <li key={oferta.id} style={{
              backgroundColor: "#f9f9f9",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
            }}>
              <p><strong>Rol:</strong> {oferta.rol}</p>
              <p><strong>Institución:</strong> {oferta.institucion}</p>
              <p><strong>Expira:</strong> {oferta.expira || "Sin fecha definida"}</p>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center", color: "#888", fontStyle: "italic" }}>
        Recuerda que los informes de métricas te llegarán directamente por correo.
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
