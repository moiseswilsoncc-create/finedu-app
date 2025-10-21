import React, { useState } from "react";

function SimuladorCredito() {
  const [monto, setMonto] = useState(1000000);
  const [cuotas, setCuotas] = useState(12);
  const [cuotaConsumo, setCuotaConsumo] = useState(95000);
  const [cuotaComercial, setCuotaComercial] = useState(85000);

  const totalConsumo = cuotaConsumo * cuotas;
  const totalComercial = cuotaComercial * cuotas;
  const ahorro = totalConsumo - totalComercial;
  const ahorroPorcentaje = (ahorro / totalConsumo) * 100;

  return (
    <div>
      <h3>Simulador de crédito</h3>

      <label>
        Monto solicitado:
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
        />
      </label>

      <label>
        Número de cuotas:
        <input
          type="number"
          value={cuotas}
          onChange={(e) => setCuotas(Number(e.target.value))}
        />
      </label>

      <label>
        Cuota mensual (crédito de consumo):
        <input
          type="number"
          value={cuotaConsumo}
          onChange={(e) => setCuotaConsumo(Number(e.target.value))}
        />
      </label>

      <label>
        Cuota mensual (crédito comercial):
        <input
          type="number"
          value={cuotaComercial}
          onChange={(e) => setCuotaComercial(Number(e.target.value))}
        />
      </label>

      <ul>
        <li>
          Crédito de consumo: total pagado ${totalConsumo.toLocaleString("es-CL")}
        </li>
        <li>
          Crédito comercial: total pagado ${totalComercial.toLocaleString("es-CL")}
        </li>
        <li>
          Ahorro estimado: ${ahorro.toLocaleString("es-CL")} ({ahorroPorcentaje.toFixed(1)}%)
        </li>
      </ul>
    </div>
  );
}

export default SimuladorCredito;
