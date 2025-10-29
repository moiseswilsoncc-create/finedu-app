import React, { useState } from "react";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";
// import { supabase } from "../supabaseClient"; // 🔄 Activar en segunda fase

type Props = {
  pais: string;
};

const SimuladorInversion: React.FC<Props> = ({ pais }) => {
  const tasaAnual = getTasa(pais, "inversion");
  const [aporteMensual, setAporteMensual] = useState(1000);
  const [plazoMeses, setPlazoMeses] = useState(12);

  const tasaMensual = tasaAnual / 12 / 100;

  const ahorroSimple = aporteMensual * plazoMeses;

  let ahorroConInteres = 0;
  for (let i = 0; i < plazoMeses; i++) {
    ahorroConInteres = (ahorroConInteres + aporteMensual) * (1 + tasaMensual);
  }

  let ahorroInvertido = 0;
  for (let i = 0; i < plazoMeses; i++) {
    const mesesRestantes = plazoMeses - i;
    ahorroInvertido += aporteMensual * Math.pow(1 + tasaMensual, mesesRestantes);
  }

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
        💡 Comparador de estrategias de ahorro e inversión ({pais})
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        <label>
          Aporte mensual:
          <input
            type="number"
            value={aporteMensual}
            onChange={(e) => setAporteMensual(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Plazo en meses:
          <input
            type="number"
            value={plazoMeses}
            onChange={(e) => setPlazoMeses(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
      </div>

      <ul style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
        <li>
          <strong>📎 Ahorro sin interés:</strong> {formatearMoneda(ahorroSimple, pais)}
        </li>
        <li>
          <strong>📈 Ahorro con interés compuesto:</strong> {formatearMoneda(ahorroConInteres, pais)}
        </li>
        <li>
          <strong>📊 Ahorro invertido mes a mes:</strong> {formatearMoneda(ahorroInvertido, pais)}
        </li>
      </ul>

      {/* 📊 Complementar en segunda fase: gráfico comparativo */}
      {/* <GraficoComparador
        ahorroSimple={ahorroSimple}
        ahorroConInteres={ahorroConInteres}
        ahorroInvertido={ahorroInvertido}
      /> */}
    </div>
  );
};

export default SimuladorInversion;
