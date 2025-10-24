import React from "react";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

type Props = {
  metaGrupal: number;
  participantes: Participante[];
};

const Resumen: React.FC<Props> = ({ metaGrupal, participantes }) => {
  const totalAhorro = participantes.reduce(
    (acc, p) => acc + (p.ingresos - p.egresos),
    0
  );

  const promedio = participantes.length > 0 ? totalAhorro / participantes.length : 0;
  const cumplimiento = Math.min((totalAhorro / metaGrupal) * 100, 100);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>💸 Resumen Financiero Grupal</h2>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "1rem" }}>
        Este módulo te permite visualizar el impacto colectivo de tu grupo en relación a la meta establecida.
      </p>

      <div style={{
        backgroundColor: "#ecf0f1",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "2rem"
      }}>
        <p><strong>Meta grupal:</strong> ${metaGrupal.toLocaleString("es-CL")}</p>
        <p><strong>Ahorro total:</strong> ${totalAhorro.toLocaleString("es-CL")}</p>
        <p><strong>Promedio por participante:</strong> ${promedio.toLocaleString("es-CL")}</p>
        <p><strong>Cumplimiento grupal:</strong> {cumplimiento.toFixed(2)}%</p>
      </div>

      {participantes.length === 0 ? (
        <p style={{ color: "#e74c3c" }}>
          ⚠️ Aún no hay participantes registrados. Puedes agregarlos desde el módulo “Mi Grupo”.
        </p>
      ) : (
        <div>
          <h3 style={{ marginBottom: "1rem" }}>👥 Detalle por participante</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {participantes.map((p, index) => {
              const ahorro = p.ingresos - p.egresos;
              return (
                <li key={index} style={{
                  backgroundColor: "#fff",
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                }}>
                  <strong>{p.nombre}</strong>: Ahorro ${ahorro.toLocaleString("es-CL")}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Resumen;
