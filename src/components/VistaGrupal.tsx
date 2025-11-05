import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Participante = {
  nombre: string;
  ahorro_neto: number;
};

type Grupo = {
  grupo_id: string;
  nombre_grupo: string;
  meta_total: number;
  participantes: Participante[];
};

const VistaGrupal: React.FC = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarGrupos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("vista_mis_grupos")
        .select("*");

      if (error) {
        console.error("❌ Error cargando vista_mis_grupos:", error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Agrupar por grupo_id
        const gruposMap: Record<string, Grupo> = {};

        data.forEach((row) => {
          if (!gruposMap[row.grupo_id]) {
            gruposMap[row.grupo_id] = {
              grupo_id: row.grupo_id,
              nombre_grupo: row.nombre_grupo,
              meta_total: row.meta_total,
              participantes: [],
            };
          }
          gruposMap[row.grupo_id].participantes.push({
            nombre: row.nombre_usuario,
            ahorro_neto: row.ahorro_neto,
          });
        });

        setGrupos(Object.values(gruposMap));
      }

      setLoading(false);
    };

    cargarGrupos();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>⏳ Cargando grupos...</p>;
  }

  if (grupos.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>👥 Sin grupo asignado</h2>
        <p>Aún no formas parte de ningún grupo. Espera a que alguien te agregue o crea uno nuevo.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>📊 Mis Grupos</h2>

      {grupos.map((grupo) => {
        const totalAhorro = grupo.participantes.reduce((acc, p) => acc + p.ahorro_neto, 0);
        const progreso = Math.min((totalAhorro / (grupo.meta_total || 1)) * 100, 100);

        const participantesOrdenados = [...grupo.participantes].sort(
          (a, b) => b.ahorro_neto - a.ahorro_neto
        );

        return (
          <div
            key={grupo.grupo_id}
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#fafafa",
            }}
          >
            <h3>👨‍👩‍👧‍👦 {grupo.nombre_grupo}</h3>
            <p><strong>Meta grupal:</strong> ${grupo.meta_total.toLocaleString("es-CL")}</p>
            <p><strong>Ahorro total:</strong> ${totalAhorro.toLocaleString("es-CL")}</p>
            <p><strong>Progreso:</strong> {progreso.toFixed(2)}%</p>

            <div style={{ background: "#eee", borderRadius: "8px", overflow: "hidden", margin: "1rem 0" }}>
              <div
                style={{
                  width: `${progreso}%`,
                  background: "#4caf50",
                  height: "20px",
                  transition: "width 0.5s ease",
                }}
                aria-label={`Progreso grupal: ${progreso.toFixed(2)}%`}
              />
            </div>

            <h4>🏅 Ranking por integrante</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {participantesOrdenados.map((p, i) => {
                const progresoIndividual = Math.min((p.ahorro_neto / (grupo.meta_total || 1)) * 100, 100);

                return (
                  <li
                    key={i}
                    style={{
                      marginBottom: "1rem",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <p>
                      <strong>{i + 1}. {p.nombre}</strong>: ${p.ahorro_neto.toLocaleString("es-CL")} (
                      {progresoIndividual.toFixed(2)}%)
                    </p>
                    <div style={{ background: "#ddd", borderRadius: "8px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${progresoIndividual}%`,
                          background: "#2196f3",
                          height: "16px",
                          transition: "width 0.5s ease",
                        }}
                        aria-label={`Progreso de ${p.nombre}: ${progresoIndividual.toFixed(2)}%`}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default VistaGrupal;
