import React from "react";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
  metaIndividual: number;
};

type Props = {
  participantes: Participante[];
};

const VistaMetaIndividual: React.FC<Props> = ({ participantes }) => {
  return (
    <div style={{ padding: "1.5rem", backgroundColor: "#fefefe", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🎯 Metas individuales</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {participantes.map((p, i) => {
          const ahorro = p.ingresos - p.egresos;
          const progreso = Math.min((ahorro / p.metaIndividual) * 100, 100);

          return (
            <li key={i} style={{ marginBottom: "1rem", padding: "0.8rem", backgroundColor: "#ecf0f1", borderRadius: "8px" }}>
              <strong>{p.nombre}</strong><br />
              Meta: <strong>${p.metaIndividual.toLocaleString("es-CL")}</strong><br />
              Ahorro actual: <strong>${ahorro.toLocaleString("es-CL")}</strong><br />
              Progreso: <strong>{progreso.toFixed(2)}%</strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VistaMetaIndividual;
