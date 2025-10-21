import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  participantes: { nombre: string; ingresos: number; egresos: number; metaIndividual: number }[];
  metaGrupal: number;
};

function GraficoAhorro({ participantes, metaGrupal }: Props) {
  const ahorros = participantes.map((p) => p.ingresos - p.egresos);
  const nombres = participantes.map((p) => p.nombre);
  const ahorroTotal = ahorros.reduce((acc, val) => acc + val, 0);
  const cumplimiento = (ahorroTotal / metaGrupal) * 100;

  const dataBarras = {
    labels: nombres,
    datasets: [
      {
        label: "Ahorro individual",
        data: ahorros,
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const dataCircular = {
    labels: ["Cumplido", "Faltante"],
    datasets: [
      {
        data: [ahorroTotal, Math.max(metaGrupal - ahorroTotal, 0)],
        backgroundColor: ["#2196F3", "#E0E0E0"],
      },
    ],
  };

  return (
    <div>
      <h3>Visualización de ahorro</h3>
      <Bar data={dataBarras} />
      <Doughnut data={dataCircular} />
      <p>Cumplimiento grupal: {cumplimiento.toFixed(1)}%</p>
    </div>
  );
}

export default GraficoAhorro;
