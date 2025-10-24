import React from "react";
import { Participante } from "../types";

type Props = {
  metaGrupal: number;
  participantes: Participante[];
};

const Resumen: React.FC<Props> = ({ metaGrupal, participantes }) => {
  const correoUsuario = localStorage.getItem("correo");
  const usuario = participantes.find(p => p.correo === correoUsuario);

  if (!usuario) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#c0392b" }}>⚠️ Usuario no encontrado</h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          No se encontraron datos financieros asociados a tu sesión. Por favor registra tus ingresos y egresos en el módulo correspondiente.
        </p>
      </div>
    );
  }

  const ahorro = usuario.ingresos - usuario.egresos;
  const cumplimiento = metaGrupal > 0 ? Math.min((ahorro / metaGrupal) * 100, 100) : 0;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        💸 Resumen de {usuario.nombre}
      </h2>

      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "1rem" }}>
        Este módulo te muestra tus ingresos, egresos y tu aporte al cumplimiento de la meta grupal.
      </p>

      <div style={{
        backgroundColor: "#ecf0f1",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "2rem"
      }}>
        <p><strong>Ingresos:</strong> ${usuario.ingresos.toLocaleString("es-CL")}</p>
        <p><strong>Egresos:</strong> ${usuario.egresos.toLocaleString("es-CL")}</p>
        <p><strong>Ahorro:</strong> ${ahorro.toLocaleString("es-CL")}</p>
        <p><strong>Cumplimiento respecto a la meta grupal:</strong> {cumplimiento.toFixed(2)}%</p>
      </div>

      <p style={{ fontSize: "0.95rem", color: "#888" }}>
        Tu correo ha sido usado internamente para identificarte, pero nunca se muestra en pantalla.
      </p>
    </div>
  );
};

export default Resumen;
