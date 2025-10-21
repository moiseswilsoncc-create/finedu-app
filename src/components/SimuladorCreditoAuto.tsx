import React, { useState } from "react";

function SimuladorCreditoAuto() {
  const [valorAuto, setValorAuto] = useState(8000000);
  const [cuotas, setCuotas] = useState(48);
  const [cuotaMensual, setCuotaMensual] = useState(220000);

  const totalPagado = cuotaMensual * cuotas;
  const diferencia = totalPagado - valorAuto;
  const sobrecostoPorcentaje = (diferencia / valorAuto) * 100;

  return (
    <div>
      <h3>Simulador crédito automotriz</h3>

      <label>
        Valor del vehículo:
        <input
          type="number"
          value={valorAuto}
          onChange={(e) => setValorAuto(Number(e.target.value))}
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
        Cuota mensual ofrecida:
        <input
          type="number"
          value={cuotaMensual}
          onChange={(e) => setCuotaMensual(Number(e.target.value))}
        />
      </label>

      <ul>
        <li>Total pagado: ${totalPagado.toLocaleString("es-CL")}</li>
        <li>Sobreprecio: ${diferencia.toLocaleString("es-CL")}</li>
        <li>Porcentaje sobre el valor del auto: {sobrecostoPorcentaje.toFixed(1)}%</li>
      </ul>
    </div>
  );
}

export default SimuladorCreditoAuto;
