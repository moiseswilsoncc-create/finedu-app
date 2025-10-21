import React from "react";
import { Participante } from "../types";

// Utilidad para calcular edad desde fecha de nacimiento
function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

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

    if (edad <= 20) gruposEdad["10–20"] += 1, (ahorroPorEdad["10–20"] += ahorro);
    else if (edad <= 35) gruposEdad["21–35"] += 1, (ahorroPorEdad["21–35"] += ahorro);
    else if (edad <= 60) gruposEdad["36–60"] += 1, (ahorroPorEdad["36–60"] += ahorro);
    else gruposEdad["60+"] += 1, (ahorroPorEdad["60+"] += ahorro);

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
        {Object.keys(gruposEdad).map((rango) => (
          <li key={rango}>
            Edad {rango}: {gruposEdad[rango]} participantes — Ahorro total: {ahorroPorEdad[rango].toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>🏙️ Participación por ciudad</h3>
      <ul>
        {Object.keys(ciudades).map((ciudad) => (
          <li key={ciudad}>
            {ciudad}: {ciudades[ciudad]} participantes — Ahorro total: {ahorroPorCiudad[ciudad].toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>🏘️ Participación por comuna</h3>
      <ul>
        {Object.keys(comunas).map((comuna) => (
          <li key={comuna}>
            {comuna}: {comunas[comuna]} participantes — Ahorro total: {ahorroPorComuna[comuna].toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>💬 Actividad comunitaria</h3>
      <ul>
        <li>Comentarios en el foro que mencionan instituciones: (pendiente de integración)</li>
        <li>Tasa de participación por ciudad y comuna: (pendiente de integración)</li>
      </ul>

      <h3>📍 Impacto comparativo entre ciudades y comunas</h3>
      <p>Estas métricas permiten visualizar dónde se concentra el ahorro, el crédito y la colaboración activa.</p>

      <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
        Estas métricas se actualizan cada 30 días y pueden ser exportadas como PDF institucional.
      </p>
    </div>
  );
}

export default MetricasColaboradores;
