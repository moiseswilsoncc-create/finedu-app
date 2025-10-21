import React from "react";
import { Participante } from "../types";
import { formatearMoneda } from "../utils/formatearMoneda";

type Props = {
  participantes: Participante[];
  metaGrupal: number;
  pais: string;
};

function GraficoAhorro({ participantes, metaGrupal, pais }: Props) {
  const totalAportado = participantes.reduce(
    (total, p) => total + (p.ingresos - p.egresos),
    0
  );

  const porcentaje = Math.min((totalAportado / metaGrupal) * 100, 100);

  return (
    <div>
      <h3>Progreso de ahorro grupal</h3>
      <p>Meta grupal: {formatearMoneda(metaGrupal, pais)}</p>
      <p>Aportado: {formatearMoneda(totalAportado, pais)}</p>
      <p>Progreso: {porcentaje.toFixed(1)}%</p>
      <progress value={porcentaje} max={100}></progress>
    </div>
  );
}

export default GraficoAhorro;
