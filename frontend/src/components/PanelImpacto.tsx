import React from "react";
import { Participante } from "../context/GrupoContext"; // si ya centralizaste el tipo

type Props = {
  metaGrupal: number;
  participantes: Participante[];
  nombreGrupoMeta?: string;
};

const PanelImpacto: React.FC<Props> = ({ metaGrupal, participantes, nombreGrupoMeta }) => {
  const totalAhorro = participantes.reduce(
    (acc, p) => acc + (p.ingresos - p.egresos),
    0
  );

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>📈 Panel de Impacto Financiero</h2>
      {nombreGrupoMeta && <p><strong>Grupo:</strong> {nombreGrupoMeta}</p>}
      <p><strong>Meta grupal:</strong> ${metaGrupal.toLocaleString("es-CL")}</p>
      <p><strong>Ahorro total:</strong> ${totalAhorro.toLocaleString("es-CL")}</p>

      <h3 style={{ marginTop: "2rem" }}>🔍 Progreso por integrante</h3>
      {participantes.map((p, i) => {
        const neto = p.ingresos - p.egresos;
        const progreso = Math.min((neto / metaGrupal) * 100, 100);

        return (
          <div key={i} style={{ marginBottom: "1.5rem" }}>
            <p><strong>{p.nombre}</strong>: ${neto.toLocaleString("es-CL")} ({progreso.toFixed(2)}%)</p>
            <div style={{ background: "#eee", borderRadius: "8px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progreso}%`,
                  background: "#2196f3",
                  height: "16px",
                  transition: "width 0.5s ease"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PanelImpacto;
