import React from "react";
import { Participante } from "../types";
import ResumenFinanciero from "./ResumenFinanciero";
import GraficoAhorro from "./GraficoAhorro";
import { formatearMoneda } from "../utils/formatearMoneda";

type Props = {
  participantes: Participante[];
  metaGrupal: number;
  pais: string;
  institucion?: string;
};

function PanelImpacto({ participantes, metaGrupal, pais, institucion }: Props) {
  const totalAhorro = participantes.reduce(
    (total, p) => total + (p.ingresos - p.egresos),
    0
  );

  return (
    <div style={{ border: "2px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h2>Panel de Impacto Financiero</h2>
      <p>
        País: <strong>{pais}</strong>
        {institucion && <> — Institución: <strong>{institucion}</strong></>}
      </p>

      <p>
        Meta grupal declarada: {formatearMoneda(metaGrupal, pais)}<br />
        Ahorro acumulado por participantes: {formatearMoneda(totalAhorro, pais)}
      </p>

      <GraficoAhorro participantes={participantes} metaGrupal={metaGrupal} pais={pais} />
      <ResumenFinanciero participantes={participantes} metaGrupal={metaGrupal} pais={pais} />

      <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
        Este panel refleja el compromiso colectivo hacia la autonomía financiera. ¡Gracias por construir futuro!
      </p>
    </div>
  );
}

export default PanelImpacto;
