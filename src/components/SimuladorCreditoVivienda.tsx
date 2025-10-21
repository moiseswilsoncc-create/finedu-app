import React, { useState } from "react";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";

type Props = {
  pais: string;
};

function SimuladorCreditoVivienda({ pais }: Props) {
  const tasaBase = getTasa(pais, "vivienda");
  const [monto, setMonto] = useState(120000000);
  const [plazoMeses, setPlazoMeses] = useState(240);

  const tasaMensual = tasaBase / 12 / 100;
  const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
  const totalPagado = cuota * plazoMeses;
  const sobrecosto = totalPagado - monto;

  return (
    <div>
      <h3>Simulador de crédito hipotecario ({pais})</h3>

      <label>
        Valor de la propiedad:
        <input type="number" value={monto} onChange={(e) => setMonto(Number(e.target.value))} />
      </label>

      <label>
        Plazo en meses:
        <input type="number" value={plazoMeses} onChange={(e) => setPlazoMeses(Number(e.target.value))} />
      </label>

      <ul>
        <li>Tasa anual: {tasaBase}%</li>
        <li>Cuota mensual: {formatearMoneda(cuota, pais)}</li>
        <li>Total pagado: {formatearMoneda(totalPagado, pais)}</li>
        <li>Sobreprecio: {formatearMoneda(sobrecosto, pais)}</li>
      </ul>
    </div>
  );
}

export default SimuladorCreditoVivienda;
