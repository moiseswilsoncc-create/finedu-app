// 📦 src/components/Visualizaciones/MapaCalor.tsx
// 🔄 Visualización institucional del ahorro por región en formato de mapa de calor vertical

import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface MapaCalorProps {
  datos: { region: string; ahorro: number }[];
}

const MapaCalor: React.FC<MapaCalorProps> = ({ datos }) => {
  const labels = datos.map((d) => d.region);
  const valores = datos.map((d) => d.ahorro);

  const data = {
    labels,
    datasets: [
      {
        label: "Ahorro por región (CLP)",
        data: valores,
        backgroundColor: "#3498db",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `$${context.parsed.y.toLocaleString("es-CL")}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) =>
            `$${value.toLocaleString("es-CL")}`,
        },
      },
    },
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        📍 Distribución geográfica del ahorro
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MapaCalor;
