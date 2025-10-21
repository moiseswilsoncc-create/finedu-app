import React from "react";
import { Participante } from "../types";
import PanelImpacto from "./PanelImpacto";

type Props = {
  participantes: Participante[];
  metaGrupal: number;
  pais: string;
  setPais: (pais: string) => void;
};

const regiones = ["Chile", "Perú", "México", "Colombia", "Argentina"];

function VistaInstitucional({ participantes, metaGrupal, pais, setPais }: Props) {
  const totalAhorro = participantes.reduce((total, p) => total + (p.ingresos - p.egresos), 0);
  const promedioAhorro = participantes.length > 0 ? totalAhorro / participantes.length : 0;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f4f8" }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="/logo-finedu.png" alt="Logo Finedu" style={{ height: "60px" }} />
        <h1>🌎 Vista Institucional Finedu LATAM</h1>
        <p>Comparativa regional de impacto financiero colaborativo</p>

        <label>
          Selecciona país:
          <select value={pais} onChange={(e) => setPais(e.target.value)}>
            {regiones.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
      </header>

      <section>
        <PanelImpacto participantes={participantes} metaGrupal={metaGrupal} pais={pais} institucion="Finedu LATAM" />
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>📊 Métricas regionales</h2>
        <ul>
          <li>Participantes activos: {participantes.length}</li>
          <li>Ahorro total acumulado: {totalAhorro.toLocaleString()}</li>
          <li>Ahorro promedio por persona: {promedioAhorro.toLocaleString()}</li>
        </ul>
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
