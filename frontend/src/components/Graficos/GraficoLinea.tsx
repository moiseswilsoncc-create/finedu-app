import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

type Props = {
  titulo: string;
  labels: string[]; // Ej: ["Enero", "Febrero", "Marzo"]
  datos: number[];  // Ej: [1200, 1350, 1420]
};

const GraficoLinea: React.FC<Props> = ({ titulo, labels, datos }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Monto acumulado (CLP)",
        data: datos,
        fill: false,
        borderColor: "#2ecc71",
        backgroundColor: "#27ae60",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: titulo,
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
      <Line data={data} options={options} />
    </div>
  );
};

export default GraficoLinea;
