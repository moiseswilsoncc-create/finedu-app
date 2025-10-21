import React, { useState } from "react";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";

type Props = {
  pais: string;
};

function SimuladorCredito({ pais }: Props) {
  const tasaBase = getTasa(pais, "consumo");
  const [monto, setMonto] = useState(1000000);
  const [plazoMeses, setPlazoMeses] = useState(12);

  const tasaMensual = tasaBase / 12 / 100;
  const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
  const totalPagado = cuota * plazoMeses;
  const sobrecosto = totalPagado - monto;

  return (
    <div>
      <h3>Simulador de crédito de consumo ({pais})</h3>

      <label>
        Monto solicitado:
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
        />
      </label>

      <label>
        Plazo en meses:
        <input
          type="number"
          value={plazoMeses}
          onChange={(e) => setPlazoMeses(Number(e.target.value))}
        />
      </label>

      <ul>
        <li>Tasa base anual: {tasaBase}%</li>
        <li>Cuota mensual estimada: {formatearMoneda(cuota, pais)}</li>
        <li>Total pagado: {formatearMoneda(totalPagado, pais)}</li>
        <li>Sobreprecio por intereses: {formatearMoneda(sobrecosto, pais)}</li>
      </ul>
    </div>
  );
}

export default SimuladorCredito;
