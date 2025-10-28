import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Participante } from "../types";
import { calcularEdad } from "../utils/calcularEdad";
import { supabase } from "../supabaseClient"; // ✅ conexión declarada

type Props = {
  metaGrupal: number;
};

function MetricasColaboradores({ metaGrupal }: Props) {
  const navigate = useNavigate();
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tipoUsuario === "colaborador") {
      navigate("/panel-colaboradores");
      return;
    }

    const obtenerParticipantes = async () => {
      const { data, error } = await supabase.from("participantes").select("*");
      if (error) {
        console.error("Error al obtener participantes:", error.message);
      } else {
        setParticipantes(data || []);
      }
      setLoading(false);
    };

    obtenerParticipantes();
  }, [navigate, tipoUsuario]);

  if (loading) return <p>Cargando métricas colaborativas…</p>;

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

  const gruposEdad = { "10–20": 0, "21–35": 0, "36–60": 0, "60+": 0 };
  const ahorroPorEdad: Record<string, number> = { "10–20": 0, "21–35": 0, "36–60": 0, "60+": 0 };
  const ciudades: Record<string, number> = {};
  const comunas: Record<string, number> = {};
  const ahorroPorCiudad: Record<string, number> = {};
  const ahorroPorComuna: Record<string, number> = {};

  // Nuevas métricas por categoría de gasto
  const categoriasGasto = {
    "Comer afuera": { actual: 0, anterior: 0 },
    "Ir al cine": { actual: 0, anterior: 0 },
    "Transporte": { actual: 0, anterior: 0 },
    "Compras": { actual: 0, anterior: 0 },
  };

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

    // Simulación de datos por categoría (pendiente conexión real)
    if (p.gastosMensuales) {
      Object.keys(categoriasGasto).forEach((cat) => {
        categoriasGasto[cat].actual += p.gastosMensuales[cat]?.actual || 0;
        categoriasGasto[cat].anterior += p.gastosMensuales[cat]?.anterior || 0;
      });
    }
  });

  return (
    <div style={{ padding: "1rem", border: "2px solid #ccc", borderRadius: "8px" }}>
      <h2>📊 Métricas colaborativas (uso institucional)</h2>

      <section>
        <h3>💰 Comportamiento financiero</h3>
        <ul>
          <li>Participantes activos: {participantes.length}</li>
          <li>Ahorro total acumulado: ${totalAhorro.toLocaleString()}</li>
          <li>Promedio de ahorro por persona: ${promedioAhorro.toLocaleString()}</li>
          <li>Total de metas individuales (crédito): ${totalCredito.toLocaleString()}</li>
          <li>Meta grupal declarada: ${metaGrupal.toLocaleString()}</li>
        </ul>
      </section>

      <section>
        <h3>📈 Variación mensual por categoría</h3>
        <ul>
          {Object.entries(categoriasGasto).map(([cat, valores]) => {
            const variacion = valores.anterior > 0
              ? ((valores.actual - valores.anterior) / valores.anterior) * 100
              : 0;
            const signo = variacion > 0 ? "🔺" : variacion < 0 ? "🔻" : "⏸️";
            return (
              <li key={cat}>
                {cat}: {signo} {variacion.toFixed(2)}%
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3>🔍 Segmentación por edad</h3>
        <ul>
          {Object.keys(gruposEdad).map((rango) => (
            <li key={rango}>
              Edad {rango}: {gruposEdad[rango]} participantes — Ahorro total: ${ahorroPorEdad[rango].toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>🏙️ Participación por ciudad</h3>
        <ul>
          {Object.keys(ciudades).map((ciudad) => (
            <li key={ciudad}>
              {ciudad}: {ciudades[ciudad]} participantes — Ahorro total: ${ahorroPorCiudad[ciudad].toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>🏘️ Participación por comuna</h3>
        <ul>
          {Object.keys(comunas).map((comuna) => (
            <li key={comuna}>
              {comuna}: {comunas[comuna]} participantes — Ahorro total: ${ahorroPorComuna[comuna].toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>📬 Envío programado</h3>
        <p>Estas métricas se enviarán automáticamente por correo a cada colaborador correspondiente cada 30 días.</p>
      </section>

      <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
        Estas métricas están diseñadas para uso institucional y pueden ser ampliadas según necesidad.
      </p>
    </div>
  );
}

export default MetricasColaboradores;
