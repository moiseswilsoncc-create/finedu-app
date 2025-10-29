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

const VistaInstitucional: React.FC<Props> = ({ participantes, metaGrupal, pais, setPais }) => {
  const totalAhorro = participantes.reduce((total, p) => total + (p.ingresos - p.egresos), 0);
  const promedioAhorro = participantes.length > 0 ? totalAhorro / participantes.length : 0;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f4f8" }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="/logo-finedu.png" alt="Logo Finedu" style={{ height: "60px" }} />
        <h1>🌎 Vista Institucional Finedu LATAM</h1>
        <p>Comparativa regional de impacto financiero colaborativo</p>

        <label style={{ display: "block", marginTop: "1rem" }}>
          Selecciona país:
          <select
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px" }}
          >
            {regiones.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
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
        <h2>📊 Métricas regionales</h2>
        <ul style={{ lineHeight: "1.6", fontSize: "1.05rem" }}>
          <li><strong>Participantes activos:</strong> {participantes.length}</li>
          <li><strong>Ahorro total acumulado:</strong> ${totalAhorro.toLocaleString("es-CL")}</li>
          <li><strong>Ahorro promedio por persona:</strong> ${promedioAhorro.toLocaleString("es-CL")}</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>📣 Testimonios destacados</h2>
        <blockquote style={{ marginBottom: "1.5rem", fontStyle: "italic", color: "#2c3e50" }}>
          “Gracias a Finedu descubrí una oferta de crédito que me ahorró más de $300.000 en intereses.”
          <br />
          <span style={{ fontStyle: "normal", color: "#7f8c8d" }}>— Camila, Santiago</span>
        </blockquote>
        <blockquote style={{ fontStyle: "italic", color: "#2c3e50" }}>
          “El simulador de inversión me ayudó a planificar mejor mis ahorros. ¡Ahora tengo metas claras!”
          <br />
          <span style={{ fontStyle: "normal", color: "#7f8c8d" }}>— Rodrigo, Valparaíso</span>
        </blockquote>
      </section>

      <footer style={{ marginTop: "3rem", textAlign: "center", fontSize: "0.9rem", color: "#888" }}>
        <p>© 2025 Finedu LATAM — Plataforma de educación y autonomía financiera</p>
      </footer>
    </div>
  );
};

export default VistaInstitucional;
