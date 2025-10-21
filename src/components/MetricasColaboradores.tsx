import React from "react";
import { Participante } from "../types";

type Props = {
  participantes: Participante[];
  metaGrupal: number;
};

function agruparPorEdad(participantes: Participante) {
  const grupos = {
    "10–20": 0,
    "21–35": 0,
    "36–60": 0,
    "60+": 0,
  };

  const ahorroPorGrupo: Record<string, number> = {
    "10–20": 0,
    "21–35": 0,
    "36–60": 0,
    "60+": 0,
  };

  participantes.forEach((p) => {
    const edad = p.edad || 0;
    const ahorro = p.ingresos - p.egresos;

    if (edad <= 20) {
      grupos["10–20"] += 1;
      ahorroPorGrupo["10–20"] += ahorro;
    } else if (edad <= 35) {
      grupos["21–35"] += 1;
      ahorroPorGrupo["21–35"] += ahorro;
    } else if (edad <= 60) {
      grupos["36–60"] += 1;
      ahorroPorGrupo["36–60"] += ahorro;
    } else {
      grupos["60+"] += 1;
      ahorroPorGrupo["60+"] += ahorro;
    }
  });

  return { grupos, ahorroPorGrupo };
}

function MetricasColaboradores({ participantes, metaGrupal }: Props) {
  const totalAhorro = participantes.reduce(
    (total, p) => total + (p.ingresos - p.egresos),
    0
  );

  const totalCredito = participantes.reduce(
    (total, p) => total + (p.metaIndividual || 0),
    0
  );

  const promedioAhorro = participantes.length > 0 ? totalAhorro / participantes.length : 0;
  const { grupos, ahorroPorGrupo } = agruparPorEdad(participantes);

  return (
    <div style={{ padding: "1rem", border: "2px solid #ccc", borderRadius: "8px" }}>
      <h2>📊 Métricas para colaboradores</h2>

      <ul>
        <li>Participantes activos: {participantes.length}</li>
        <li>Ahorro total acumulado: {totalAhorro.toLocaleString()}</li>
        <li>Promedio de ahorro por persona: {promedioAhorro.toLocaleString()}</li>
        <li>Total de metas individuales (crédito): {totalCredito.toLocaleString()}</li>
        <li>Meta grupal declarada: {metaGrupal.toLocaleString()}</li>
      </ul>

      <h3>🔍 Segmentación por edad</h3>
      <ul>
        {Object.keys(grupos).map((rango) => (
          <li key={rango}>
            Edad {rango}: {grupos[rango]} participantes — Ahorro total: {ahorroPorGrupo[rango].toLocaleString()}
          </li>
        ))}
      </ul>

      <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
        Estas métricas se actualizan cada 30 días y pueden ser enviadas por correo a las instituciones colaboradoras.
      </p>
    </div>
  );
}

export default MetricasColaboradores;
