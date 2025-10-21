import React, { useState } from "react";

function SimuladorCreditoVivienda() {
  const [valorPropiedad, setValorPropiedad] = useState(120000000);
  const [cuotas, setCuotas] = useState(240); // 20 años
  const [cuotaMensual, setCuotaMensual] = useState(850000);

  const totalPagado = cuotaMensual * cuotas;
  const diferencia = totalPagado - valorPropiedad;
  const sobrecostoPorcentaje = (diferencia / valorPropiedad) * 100;

  return (
    <div>
      <h3>Simulador crédito vivienda</h3>

      <label>
        Valor de la propiedad:
        <input
          type="number"
          value={valorPropiedad}
          onChange={(e) => setValorPropiedad(Number(e.target.value))}
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
        <li>Porcentaje sobre el valor de la propiedad: {sobrecostoPorcentaje.toFixed(1)}%</li>
      </ul>
    </div>
  );
}

export default SimuladorCreditoVivienda;
