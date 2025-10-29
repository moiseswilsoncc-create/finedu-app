import React from "react";

type Credito = {
  nombre: string;
  tipo: "consumo" | "hipotecario";
  plazoTotal: number;
  cuotaActual: number;
  cuotaMensual: number;
};

type OfertaSimulada = {
  monto: number;
  tasa: number;
  plazo: number;
};

type Props = {
  ingresosMensuales: number;
  egresosMensuales: number;
  creditosActivos: Credito[];
  ofertaSimulada?: OfertaSimulada;
};

const EvaluadorCreditoInteligente: React.FC<Props> = ({
  ingresosMensuales,
  egresosMensuales,
  creditosActivos,
  ofertaSimulada
}) => {
  const tramos = [6, 12, 24, 48];

  const cargaPorTramo = tramos.map((meses) => {
    const carga = creditosActivos
      .filter(c => c.plazoTotal - c.cuotaActual <= meses)
      .reduce((acc, c) => acc + c.cuotaMensual, 0);

    const cuotaSimulada = ofertaSimulada
      ? calcularCuota(ofertaSimulada.monto, ofertaSimulada.tasa, ofertaSimulada.plazo)
      : 0;

    const cargaTotal = carga + cuotaSimulada;
    const porcentaje = (cargaTotal / ingresosMensuales) * 100;

    return {
      meses,
      carga,
      cuotaSimulada,
      cargaTotal,
      porcentaje,
      recomendacion: generarRecomendacion(porcentaje, meses)
    };
  });

  return (
    <div style={{
      maxWidth: "700px",
      margin: "2rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "12px",
      backgroundColor: "#fefefe"
    }}>
      <h2 style={{ color: "#2c3e50" }}>🧠 Evaluación Inteligente de Carga Crediticia</h2>
      <p><strong>Ingresos mensuales:</strong> ${ingresosMensuales.toLocaleString("es-CL")}</p>
      <p><strong>Egresos mensuales:</strong> ${egresosMensuales.toLocaleString("es-CL")}</p>

      <h3 style={{ marginTop: "2rem", color: "#34495e" }}>📊 Proyección por tramos</h3>
      {cargaPorTramo.map((tramo, index) => (
        <div key={index} style={{
          marginTop: "1.5rem",
          padding: "1rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px"
        }}>
          <h4>⏳ Próximos {tramo.meses} meses</h4>
          <p>Carga actual por créditos en este tramo: ${tramo.carga.toLocaleString("es-CL")}</p>
          {ofertaSimulada && (
            <p>Cuota estimada de nueva oferta: ${tramo.cuotaSimulada.toLocaleString("es-CL")}</p>
          )}
          <p><strong>Carga total proyectada:</strong> ${tramo.cargaTotal.toLocaleString("es-CL")} ({tramo.porcentaje.toFixed(1)}%)</p>
          <p><strong>Recomendación:</strong> {tramo.recomendacion}</p>
        </div>
      ))}

      <h3 style={{ marginTop: "2rem", color: "#34495e" }}>📄 Detalle de Créditos Activos</h3>
      {creditosActivos.map((c) => mostrarDetalleCredito(c))}
    </div>
  );
};

function calcularCuota(monto: number, tasaAnual: number, plazoMeses: number): number {
  const tasaMensual = tasaAnual / 12 / 100;
  return (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
}

function generarRecomendacion(porcentaje: number, meses: number): string {
  if (porcentaje > 45) return `🔴 No recomendable en los próximos ${meses} meses. Tu carga supera el 45%.`;
  if (porcentaje > 35) return `🟡 Evaluar con cautela. Tu carga está entre 35% y 45%.`;
  return `🟢 Recomendable. Tu carga proyectada es saludable.`;
}

function mostrarDetalleCredito(credito: Credito) {
  const pagado = credito.cuotaActual * credito.cuotaMensual;
  const restanteMeses = credito.plazoTotal - credito.cuotaActual;
  const restanteDinero = restanteMeses * credito.cuotaMensual;

  return (
    <div key={credito.nombre} style={{
      marginBottom: "1rem",
      padding: "1rem",
      backgroundColor: "#f4f4f4",
      borderRadius: "8px"
    }}>
      <h4>📄 {credito.nombre} ({credito.tipo})</h4>
      <p>Plazo total: {credito.plazoTotal} meses</p>
      <p>Cuota actual: {credito.cuotaActual} / {credito.plazoTotal}</p>
      <p>Valor de la cuota: ${credito.cuotaMensual.toLocaleString("es-CL")}</p>
      <p>Total pagado: ${pagado.toLocaleString("es-CL")}</p>
      <p>Faltan: ${restanteDinero.toLocaleString("es-CL")} ({restanteMeses} meses)</p>
    </div>
  );
}

export default EvaluadorCreditoInteligente;
