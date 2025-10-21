import React from "react";
import { Participante } from "../types";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";

type Props = {
  participantes: Participante[];
  metaGrupal: number;
  pais: string;
};

function ResumenFinanciero({ participantes, metaGrupal, pais }: Props) {
  const tasaCredito = getTasa(pais, "consumo");
  const tasaInversion = getTasa(pais, "inversion");

  const totalAhorro = participantes.reduce(
    (total, p) => total + (p.ingresos - p.egresos),
    0
  );

  const cuotaCredito = (metaGrupal * (tasaCredito / 12 / 100)) /
    (1 - Math.pow(1 + tasaCredito / 12 / 100, -12));
  const totalCredito = cuotaCredito * 12;

  const montoInversion = totalAhorro;
  const montoFinalInversion = montoInversion * Math.pow(1 + tasaInversion / 12 / 100, 12);
  const gananciaInversion = montoFinalInversion - montoInversion;

  return (
    <div>
      <h3>Resumen financiero comparativo ({pais})</h3>

      <ul>
        <li>Meta grupal: {formatearMoneda(metaGrupal, pais)}</li>
        <li>Ahorro actual del grupo: {formatearMoneda(totalAhorro, pais)}</li>
        <li>
          Crédito de consumo (12 meses a {tasaCredito}% anual):{" "}
          {formatearMoneda(totalCredito, pais)}
        </li>
        <li>
          Inversión proyectada (12 meses a {tasaInversion}% anual):{" "}
          {formatearMoneda(montoFinalInversion, pais)} (ganancia:{" "}
          {formatearMoneda(gananciaInversion, pais)})
        </li>
      </ul>
    </div>
  );
}

export default ResumenFinanciero;
