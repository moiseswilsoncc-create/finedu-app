import React, { useState } from "react";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";
// import { supabase } from "../supabaseClient"; // 🔄 Activar en segunda fase

type Props = {
  pais: string;
};

function SimuladorInversion({ pais }: Props) {
  const tasaAnual = getTasa(pais, "inversion");
  const [aporteMensual, setAporteMensual] = useState(1000);
  const [plazoMeses, setPlazoMeses] = useState(12);

  const tasaMensual = tasaAnual / 12 / 100;

  // 1. Ahorro sin interés
  const ahorroSimple = aporteMensual * plazoMeses;

  // 2. Ahorro con interés compuesto sobre saldo acumulado
  let ahorroConInteres = 0;
  for (let i = 0; i < plazoMeses; i++) {
    ahorroConInteres = (ahorroConInteres + aporteMensual) * (1 + tasaMensual);
  }

  // 3. Ahorro invertido mes a mes (cada aporte se capitaliza por su tiempo restante)
  let ahorroInvertido = 0;
  for (let i = 0; i < plazoMeses; i++) {
    const mesesRestantes = plazoMeses - i;
    ahorroInvertido += aporteMensual * Math.pow(1 + tasaMensual, mesesRestantes);
  }

  return (
    <div>
      <h3>Comparador de estrategias de ahorro e inversión ({pais})</h3>

      <label>
        Aporte mensual:
        <input
          type="number"
          value={aporteMensual}
          onChange={(e) => setAporteMensual(Number(e.target.value))}
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
        <li>
          <strong>Ahorro sin interés:</strong>{" "}
          {formatearMoneda(ahorroSimple, pais)}
        </li>
        <li>
          <strong>Ahorro con interés compuesto:</strong>{" "}
          {formatearMoneda(ahorroConInteres, pais)}
        </li>
        <li>
          <strong>Ahorro invertido mes a mes:</strong>{" "}
          {formatearMoneda(ahorroInvertido, pais)}
        </li>
      </ul>

      {/* 📊 Complementar: agregar gráfico comparativo en segunda fase */}
      {/* <GraficoComparador
        ahorroSimple={ahorroSimple}
        ahorroConInteres={ahorroConInteres}
        ahorroInvertido={ahorroInvertido}
      /> */}
    </div>
  );
}

export default SimuladorInversion;
