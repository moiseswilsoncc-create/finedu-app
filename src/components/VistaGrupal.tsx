import React from "react";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

type Props = {
  nombreGrupoMeta: string;
  metaGrupal: number;
  participantes: Participante[];
};

function VistaGrupal({ nombreGrupoMeta, metaGrupal, participantes }: Props) {
  const totalAhorro = participantes.reduce(
    (acc, p) => acc + (p.ingresos - p.egresos),
    0
  );

  const progreso = Math.min((totalAhorro / metaGrupal) * 100, 100);

  return (
    <div>
      <h2>{nombreGrupoMeta}</h2>
      <p>Meta grupal: ${metaGrupal.toLocaleString("es-CL")}</p>
      <p>Ahorro total: ${totalAhorro.toLocaleString("es-CL")}</p>
      <p>Progreso: {progreso.toFixed(2)}%</p>
      <ul>
        {participantes.map((p, i) => (
          <li key={i}>
            {p.nombre}: ${p.ingresos - p.egresos}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VistaGrupal;
