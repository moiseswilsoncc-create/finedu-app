import React, { useState } from "react";
import { formatearMoneda } from "../utils/formatearMoneda";
// import { supabase } from "../supabaseClient"; // 🔄 Activar en segunda fase

type Props = {
  pais: string;
};

const SimuladorAhorroGrupal: React.FC<Props> = ({ pais }) => {
  const [metaTotal, setMetaTotal] = useState(100000);
  const [participantes, setParticipantes] = useState(5);
  const [aporteMensual, setAporteMensual] = useState(1000);

  const aporteGrupalMensual = participantes * aporteMensual;
  const mesesEstimados = Math.ceil(metaTotal / aporteGrupalMensual);
  const totalAportado = aporteGrupalMensual * mesesEstimados;

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "700px",
      margin: "2rem auto",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        👥 Simulador de Ahorro Grupal ({pais})
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        <label>
          Meta total:
          <input
            type="number"
            value={metaTotal}
            onChange={(e) => setMetaTotal(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Número de participantes:
          <input
            type="number"
            value={participantes}
            onChange={(e) => setParticipantes(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Aporte mensual por persona:
          <input
            type="number"
            value={aporteMensual}
            onChange={(e) => setAporteMensual(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
      </div>

      <ul style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
        <li>
          <strong>🧮 Aporte grupal mensual:</strong> {formatearMoneda(aporteGrupalMensual, pais)}
        </li>
        <li>
          <strong>📅 Meses estimados para alcanzar la meta:</strong> {mesesEstimados}
        </li>
        <li>
          <strong>📦 Total aportado al final:</strong> {formatearMoneda(totalAportado, pais)}
        </li>
      </ul>

      {/* 📊 Complementar en segunda fase: gráfico de progreso grupal */}
    </div>
  );
};

export default SimuladorAhorroGrupal;
