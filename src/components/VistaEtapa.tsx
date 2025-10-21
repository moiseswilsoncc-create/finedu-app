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
    const ahorroProyectado = ahorroTotal * (meses / 1); // suponiendo que los datos son mensuales
    return ahorroProyectado;
  };

  return (
    <div>
      <h3>Proyección por etapas</h3>
      <ul>
        <li>1 mes: ${calcularPorEtapa(1).toLocaleString("es-CL")}</li>
        <li>3 meses: ${calcularPorEtapa(3).toLocaleString("es-CL")}</li>
        <li>6 meses: ${calcularPorEtapa(6).toLocaleString("es-CL")}</li>
        <li>12 meses: ${calcularPorEtapa(12).toLocaleString("es-CL")}</li>
      </ul>
    </div>
  );
}

export default VistaEtapa;
