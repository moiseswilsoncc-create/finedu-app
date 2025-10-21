import React from "react";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

type Props = {
  metaGrupal: number;
  participantes: Participante[];
};

function Resumen({ metaGrupal, participantes }: Props) {
  const totalAhorro = participantes.reduce(
    (acc, p) => acc + (p.ingresos - p.egresos),
    0
  );

  const promedio = participantes.length > 0 ? totalAhorro / participantes.length : 0;
  const cumplimiento = Math.min((totalAhorro / metaGrupal) * 100, 100);

  return (
    <div>
      <h3>Resumen financiero</h3>
      <p>Ahorro total: ${totalAhorro.toLocaleString("es-CL")}</p>
      <p>Promedio por participante: ${promedio.toLocaleString("es-CL")}</p>
      <p>Cumplimiento grupal: {cumplimiento.toFixed(2)}%</p>
    </div>
  );
}

export default Resumen;
