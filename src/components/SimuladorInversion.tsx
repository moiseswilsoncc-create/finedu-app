import React, { useState } from "react";

function SimuladorInversion() {
  const [montoInicial, setMontoInicial] = useState(1000000);
  const [tasaAnual, setTasaAnual] = useState(8); // % anual
  const [plazoMeses, setPlazoMeses] = useState(12);

  const tasaMensual = tasaAnual / 12 / 100;
  const montoFinal = montoInicial * Math.pow(1 + tasaMensual, plazoMeses);
  const ganancia = montoFinal - montoInicial;

  return (
    <div>
      <h3>Simulador de inversión</h3>

      <label>
        Monto inicial:
        <input
          type="number"
          value={montoInicial}
          onChange={(e) => setMontoInicial(Number(e.target.value))}
        />
      </label>

      <label>
        Tasa anual (%):
        <input
          type="number"
          value={tasaAnual}
          onChange={(e) => setTasaAnual(Number(e.target.value))}
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
        <li>Monto final estimado: ${montoFinal.toLocaleString("es-CL")}</li>
        <li>Ganancia proyectada: ${ganancia.toLocaleString("es-CL")}</li>
      </ul>
    </div>
  );
}

export default SimuladorInversion;
