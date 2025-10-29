import React, { useEffect, useState } from "react";

const AsistenteFinanciero = () => {
  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);

  useEffect(() => {
    // Simulación de datos financieros del usuario
    const ahorroMensual = [50000, 60000, 70000, 80000]; // últimos 4 meses
    const testFinanciero = [60, 65, 70]; // puntajes históricos
    const perfilRiesgo = "moderado"; // puede venir del test

    const recomendacionesGeneradas: string[] = [];

    // Análisis de ahorro
    const crecimiento = ahorroMensual[3] - ahorroMensual[0];
    if (crecimiento > 20000) {
      recomendacionesGeneradas.push("📈 Tu ahorro ha aumentado un 40% en los últimos 4 meses. ¡Excelente progreso!");
    }

    // Análisis de test financiero
    const mejoraTest = testFinanciero[testFinanciero.length - 1] - testFinanciero[0];
    if (mejoraTest > 5) {
      recomendacionesGeneradas.push("🧠 Has mejorado tu puntaje financiero. Tu comprensión está creciendo.");
    }

    // Perfil de riesgo
    if (perfilRiesgo === "moderado") {
      recomendacionesGeneradas.push("⚖️ Tu perfil de riesgo es moderado. Puedes explorar inversiones con retorno medio.");
    }

    setRecomendaciones(recomendacionesGeneradas);
  }, []);

  return (
    <div style={{ padding: "1.5rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <h2>🤖 Asistente Financiero Inteligente</h2>
      <p>Este módulo analiza tu comportamiento financiero y te entrega recomendaciones personalizadas:</p>
      <ul>
        {recomendaciones.map((rec, index) => (
          <li key={index} style={{ marginBottom: "0.75rem" }}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default AsistenteFinanciero;
