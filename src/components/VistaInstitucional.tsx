import React from "react";
import { Participante } from "../types";
import PanelImpacto from "./PanelImpacto";

type Props = {
  participantes: Participante[];
  metaGrupal: number;
  pais: string;
};

function VistaInstitucional({ participantes, metaGrupal, pais }: Props) {
  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9" }}>
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <img src="/logo-finedu.png" alt="Logo Finedu" style={{ height: "60px" }} />
        <h1>Impacto Financiero Colaborativo</h1>
        <p>
          Esta vista institucional muestra el progreso colectivo de usuarios en{" "}
          <strong>{pais}</strong>, promoviendo autonomía, educación y oportunidades reales.
        </p>
      </header>

      <section>
        <PanelImpacto
          participantes={participantes}
          metaGrupal={metaGrupal}
          pais={pais}
          institucion="Finedu LATAM"
        />
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>📣 Testimonios destacados</h2>
        <blockquote>
          “Gracias a Finedu descubrí una oferta de crédito que me ahorró más de $300.000 en intereses.”
          <br />
          <span style={{ fontStyle: "italic" }}>— Camila, Santiago</span>
        </blockquote>
        <blockquote>
          “El simulador de inversión me ayudó a planificar mejor mis ahorros. ¡Ahora tengo metas claras!”
          <br />
          <span style={{ fontStyle: "italic" }}>— Rodrigo, Valparaíso</span>
        </blockquote>
      </section>

      <footer style={{ marginTop: "3rem", textAlign: "center", fontSize: "0.9rem" }}>
        <p>© 2025 Finedu LATAM — Plataforma de educación y autonomía financiera</p>
      </footer>
    </div>
  );
}

export default VistaInstitucional;
