import React from "react";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

type Props = {
  participantes: Participante[];
};

function VistaEtapa({ participantes }: Props) {
  const calcularPorEtapa = (meses: number) => {
    const ahorroTotal = participantes.reduce(
      (acc, p) => acc + (p.ingresos - p.egresos),
      0
    );
    return ahorroTotal * meses;
  };

  const calcularIndividual = (p: Participante, meses: number) =>
    (p.ingresos - p.egresos) * meses;

  return (
    <div>
      <h3>Proyección por etapas</h3>
      <ul>
        <li>1 mes: ${calcularPorEtapa(1).toLocaleString("es-CL")}</li>
        <li>3 meses: ${calcularPorEtapa(3).toLocaleString("es-CL")}</li>
        <li>6 meses: ${calcularPorEtapa(6).toLocaleString("es-CL")}</li>
        <li>12 meses: ${calcularPorEtapa(12).toLocaleString("es-CL")}</li>
      </ul>

      <h4>Ahorro individual proyectado (12 meses)</h4>
      <ul>
        {participantes.map((p, i) => (
          <li key={i}>
            {p.nombre}: ${calcularIndividual(p, 12).toLocaleString("es-CL")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VistaEtapa;
