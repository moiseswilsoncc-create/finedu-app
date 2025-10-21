import React, { useState } from "react";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";

type Props = {
  pais: string;
};

function SimuladorInversion({ pais }: Props) {
  const tasaAnual = getTasa(pais, "inversion");
  const [monto, setMonto] = useState(1000000);
  const [plazoMeses, setPlazoMeses] = useState(12);

  const tasaMensual = tasaAnual / 12 / 100;
  const montoFinal = monto * Math.pow(1 + tasaMensual, plazoMeses);
  const ganancia = montoFinal - monto;

  return (
    <div>
      <h3>Simulador de inversión ({pais})</h3>

      <label>
        Monto a invertir:
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
        <li>Tasa anual estimada: {tasaAnual}%</li>
        <li>Ganancia estimada: {formatearMoneda(ganancia, pais)}</li>
        <li>Monto final proyectado: {formatearMoneda(montoFinal, pais)}</li>
      </ul>
    </div>
  );
}

export default SimuladorInversion;
