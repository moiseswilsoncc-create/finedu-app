import React from "react";

interface Props {
  meta: number;
  meses: number;
  metaIndividual: number;
  cuotaMensual: number;
  setMeta: (v: number) => void;
  setMeses: (v: number) => void;
}

const BloqueMetaFinanciera: React.FC<Props> = ({
  meta, meses, metaIndividual, cuotaMensual, setMeta, setMeses
}) => {
  const fechaInicial = new Date();
  const mesInicio = fechaInicial.toLocaleString("es-CL", { month: "long" });
  const añoInicio = fechaInicial.getFullYear();

  const fechaTermino = new Date(fechaInicial);
  fechaTermino.setMonth(fechaInicial.getMonth() + meses);
  const mesTermino = fechaTermino.toLocaleString("es-CL", { month: "long" });
  const añoTermino = fechaTermino.getFullYear();

  return (
    <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>💰 Meta y planificación financiera</h3>

      <label>Monto meta grupal (CLP):</label>
      <input type="number" value={meta} onChange={(e) => setMeta(Number(e.target.value))} />

      <label>Meses de ahorro:</label>
      <input type="number" min={1} max={36} value={meses} onChange={(e) => setMeses(Number(e.target.value))} />

      <p>📅 Fecha de inicio automática: <strong>{mesInicio} {añoInicio}</strong></p>
      <p>🔚 Fecha estimada de término: <strong>{mesTermino} {añoTermino}</strong></p>

      <p>🎯 Meta individual total: <strong>${metaIndividual.toLocaleString("es-CL")}</strong></p>
      <p>📆 Cuota mensual por persona: <strong>${cuotaMensual.toLocaleString("es-CL")}</strong></p>
    </div>
  );
};

export default BloqueMetaFinanciera;
