import React from "react";
import { Participante } from "../types";
import { calcularEdad } from "../utils/calcularEdad";

type Props = {
  participantes: Participante[];
  metaGrupal: number;
};

function MetricasColaboradores({ participantes, metaGrupal }: Props) {
  const totalAhorro = participantes.reduce(
    (total, p) => total + (p.ingresos - p.egresos),
    0
  );

  const totalCredito = participantes.reduce(
    (total, p) => total + (p.metaIndividual || 0),
    0
  );

  const promedioAhorro =
    participantes.length > 0 ? totalAhorro / participantes.length : 0;

  // Segmentación por edad
  const gruposEdad = {
    "10–20": 0,
    "21–35": 0,
    "36–60": 0,
    "60+": 0,
  };

  const ahorroPorEdad: Record<string, number> = {
    "10–20": 0,
    "21–35": 0,
    "36–60": 0,
    "60+": 0,
  };

  // Segmentación por ciudad y comuna
  const ciudades: Record<string, number> = {};
  const comunas: Record<string, number> = {};
  const ahorroPorCiudad: Record<string, number> = {};
  const ahorroPorComuna: Record<string, number> = {};

  participantes.forEach((p) => {
    const edad = calcularEdad(p.fechaNacimiento);
    const ahorro = p.ingresos - p.egresos;

    if (edad <= 20) gruposEdad["10–20"]++, (ahorroPorEdad["10–20"] += ahorro);
    else if (edad <= 35) gruposEdad["21–35"]++, (ahorroPorEdad["21–35"] += ahorro);
    else if (edad <= 60) gruposEdad["36–60"]++, (ahorroPorEdad["36–60"] += ahorro);
    else gruposEdad["60+"]++, (ahorroPorEdad["60+"] += ahorro);

    if (p.ciudad) {
      ciudades[p.ciudad] = (ciudades[p.ciudad] || 0) + 1;
      ahorroPorCiudad[p.ciudad] = (ahorroPorCiudad[p.ciudad] || 0) + ahorro;
    }

    if (p.comuna) {
      comunas[p.comuna] = (comunas[p.comuna] || 0) + 1;
      ahorroPorComuna[p.comuna] = (ahorroPorComuna[p.comuna] || 0) + ahorro;
    }
  });

  return (
    <div style={{ padding: "1rem", border: "2px solid #ccc", borderRadius: "8px" }}>
      <h2>📊 Métricas colaborativas</h2>

      <h3>💰 Comportamiento financiero</h3>
      <ul>
        <li>Participantes activos: {participantes.length}</li>
        <li>Ahorro total acumulado: ${totalAhorro.toLocaleString()}</li>
        <li>Promedio de ahorro por persona: ${promedioAhorro.toLocaleString()}</li>
        <li>Total de metas individuales (crédito): ${totalCredito.toLocaleString()}</li>
        <li>Meta grupal declarada: ${metaGrupal.toLocaleString()}</li>
      </ul>

      <h3>🧠 Educación financiera</h3>
      <ul>
        <li>Simuladores utilizados (pendiente de integración)</li>
        <li>Promedio de simulaciones por usuario (pendiente)</li>
        <li>Usuarios que usaron más de un simulador (pendiente)</li>
      </ul>

      <h3>🤝 Colaboración grupal</h3>
      <ul>
        <li>Metas grupales creadas (pendiente)</li>
        <li>Participantes por meta grupal (pendiente)</li>
        <li>Porcentaje de cumplimiento grupal (pendiente)</li>
      </ul>

      <h3>🔍 Segmentación por edad</h3>
      <ul>
        {Object.keys(gruposEdad).map((rango) => (
          <li key={rango}>
            Edad {rango}: {gruposEdad[rango]} participantes — Ahorro total: ${ahorroPorEdad[rango].toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>🏙️ Participación por ciudad</h3>
      <ul>
        {Object.keys(ciudades).map((ciudad) => (
          <li key={ciudad}>
            {ciudad}: {ciudades[ciudad]} participantes — Ahorro total: ${ahorroPorCiudad[ciudad].toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>🏘️ Participación por comuna</h3>
      <ul>
        {Object.keys(comunas).map((comuna) => (
          <li key={comuna}>
            {comuna}: {comunas[comuna]} participantes — Ahorro total: ${ahorroPorComuna[comuna].toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>💬 Comunidad y foro</h3>
      <ul>
        <li>Comentarios que mencionan instituciones (pendiente)</li>
        <li>Tasa de participación por ciudad y comuna (pendiente)</li>
      </ul>

      <h3>📍 Impacto comparativo</h3>
      <p>Visualización del ahorro y participación por ciudad y comuna para orientar futuras campañas.</p>

      <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
        Estas métricas se actualizan cada 30 días y pueden ser exportadas como PDF institucional.
      </p>
    </div>
  );
}

export default MetricasColaboradores;
