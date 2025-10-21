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

function VistaMetaIndividual({ participantes }: Props) {
  return (
    <div>
      <h3>Metas individuales</h3>
      <ul>
        {participantes.map((p, i) => {
          const ahorro = p.ingresos - p.egresos;
          const progreso = Math.min((ahorro / p.metaIndividual) * 100, 100);

          return (
            <li key={i}>
              <strong>{p.nombre}</strong>: Meta ${p.metaIndividual.toLocaleString("es-CL")} — Ahorro ${ahorro.toLocaleString("es-CL")} — Progreso {progreso.toFixed(2)}%
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default VistaMetaIndividual;
