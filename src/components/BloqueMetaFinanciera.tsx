// src/components/BloqueMetaFinanciera.tsx
import React from "react";
import { useUserPerfil } from "../context/UserContext"; // 👈 integración con UserContext

interface Props {
  metaTotal: number;              // 👈 nombre alineado con la BD
  plazoMeses: number;             // 👈 nombre alineado con la BD
  metaIndividual: number;
  aporteMensual: number;          // 👈 nombre alineado con la BD
  setMetaTotal: (v: number) => void;
  setPlazoMeses: (v: number) => void;
}

const BloqueMetaFinanciera: React.FC<Props> = ({
  metaTotal,
  plazoMeses,
  metaIndividual,
  aporteMensual,
  setMetaTotal,
  setPlazoMeses,
}) => {
  const perfil = useUserPerfil(); // 👈 obtenemos nombre+apellido+correo

  const fechaInicial = new Date();
  const mesInicio = fechaInicial.toLocaleString("es-CL", { month: "long" });
  const añoInicio = fechaInicial.getFullYear();

  const fechaTermino = new Date(fechaInicial);
  fechaTermino.setMonth(fechaInicial.getMonth() + plazoMeses);
  const mesTermino = fechaTermino.toLocaleString("es-CL", { month: "long" });
  const añoTermino = fechaTermino.getFullYear();

  return (
    <div
      style={{
        marginBottom: "2rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h3>💰 Meta y planificación financiera</h3>

      <label>Monto meta grupal (CLP):</label>
      <input
        type="number"
        value={metaTotal}
        onChange={(e) => setMetaTotal(Number(e.target.value))}
      />

      <label>Meses de ahorro:</label>
      <input
        type="number"
        min={1}
        max={36}
        value={plazoMeses}
        onChange={(e) => setPlazoMeses(Number(e.target.value))}
      />

      <p>
        📅 Fecha de inicio automática:{" "}
        <strong>
          {mesInicio} {añoInicio}
        </strong>
      </p>
      <p>
        🔚 Fecha estimada de término:{" "}
        <strong>
          {mesTermino} {añoTermino}
        </strong>
      </p>

      <p>
        🎯 Meta individual total:{" "}
        <strong>${metaIndividual.toLocaleString("es-CL")}</strong>
      </p>
      <p>
        📆 Aporte mensual por persona:{" "}
        <strong>${aporteMensual.toLocaleString("es-CL")}</strong>
      </p>

      {perfil && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#2c3e50" }}>
          Administrador: {perfil.nombre} {perfil.apellido}
        </p>
      )}
    </div>
  );
};

export default BloqueMetaFinanciera;
