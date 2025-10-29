import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  ahorroSimple: number;
  ahorroConInteres: number;
  ahorroInvertido: number;
};

const GraficoComparador: React.FC<Props> = ({
  ahorroSimple,
  ahorroConInteres,
  ahorroInvertido
}) => {
  const data = {
    labels: ["Ahorro simple", "Interés compuesto", "Inversión mensual"],
    datasets: [
      {
        label: "Monto acumulado (CLP)",
        data: [ahorroSimple, ahorroConInteres, ahorroInvertido],
        backgroundColor: ["#3498db", "#2ecc71", "#e67e22"],
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Comparativa de Estrategias de Ahorro e Inversión",
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `$${context.raw.toLocaleString("es-CL")}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString("es-CL")}`
        }
      }
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GraficoComparador;
