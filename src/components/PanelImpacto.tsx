import React from "react";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

type Props = {
  nombreGrupoMeta: string;
  metaGrupal: number;
  participantes: Participante[];
};

const VistaGrupal: React.FC<Props> = ({ nombreGrupoMeta, metaGrupal, participantes }) => {
  const totalAhorro = participantes.reduce(
    (acc, p) => acc + (p.ingresos - p.egresos),
    0
  );

  const progreso = Math.min((totalAhorro / metaGrupal) * 100, 100);

  const participantesOrdenados = [...participantes].sort(
    (a, b) => (b.ingresos - b.egresos) - (a.ingresos - a.egresos)
  );

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>📊 Vista Grupal: {nombreGrupoMeta}</h2>
      <p><strong>Meta grupal:</strong> ${metaGrupal.toLocaleString("es-CL")}</p>
      <p><strong>Ahorro total:</strong> ${totalAhorro.toLocaleString("es-CL")}</p>
      <p><strong>Progreso:</strong> {progreso.toFixed(2)}%</p>

      <div style={{ background: "#eee", borderRadius: "8px", overflow: "hidden", margin: "1rem 0" }}>
        <div
          style={{
            width: `${progreso}%`,
            background: "#4caf50",
            height: "20px",
            transition: "width 0.5s ease"
          }}
        />
      </div>

      <h3>🏅 Ranking por integrante</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {participantesOrdenados.map((p, i) => {
          const neto = p.ingresos - p.egresos;
          const progresoIndividual = Math.min((neto / metaGrupal) * 100, 100);

          return (
            <li key={i} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
              <p><strong>{i + 1}. {p.nombre}</strong>: ${neto.toLocaleString("es-CL")} ({progresoIndividual.toFixed(2)}%)</p>
              <div style={{ background: "#ddd", borderRadius: "8px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${progresoIndividual}%`,
                    background: "#2196f3",
                    height: "16px",
                    transition: "width 0.5s ease"
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VistaGrupal;
