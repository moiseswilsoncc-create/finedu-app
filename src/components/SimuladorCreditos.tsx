import React, { useState, useEffect } from "react";
import { formatearMoneda } from "../utils/formatearMoneda";
import { supabase } from "../supabaseClient";

const SimuladorCreditos: React.FC<{ pais: string }> = ({ pais }) => {
  const [monto, setMonto] = useState<number | "">("");
  const [cuotas, setCuotas] = useState<number | "">("");
  const [valorCuota, setValorCuota] = useState<number | "">("");
  const [cuotasVigentes, setCuotasVigentes] = useState(0);

  // Traer créditos vigentes desde Supabase (Egresos → Créditos)
  useEffect(() => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) return;

    const obtenerCreditos = async () => {
      const { data: creditos } = await supabase
        .from("creditos")
        .select("cuota_mensual")
        .eq("usuario_id", usuarioId)
        .eq("activo", true);

      if (creditos) {
        const total = creditos.reduce((sum, c) => sum + (c.cuota_mensual ?? 0), 0);
        setCuotasVigentes(total);
      }
    };

    obtenerCreditos();
  }, []);

  const m = typeof monto === "number" ? monto : 0;
  const n = typeof cuotas === "number" ? cuotas : 0;
  const pmt = typeof valorCuota === "number" ? valorCuota : 0;

  const totalPagar = pmt && n ? pmt * n : 0;
  const intereses = m && totalPagar ? totalPagar - m : 0;
  const interesPct = m > 0 ? (intereses / m) * 100 : 0;

  const compromisoMensual = pmt ? pmt + cuotasVigentes : cuotasVigentes;

  const fechaFin = n
    ? new Date(new Date().setMonth(new Date().getMonth() + n)).toISOString().split("T")[0]
    : "-";

  // Proyección de próximos 6 meses
  const proyeccion6Meses = Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + (i + 1));
    return {
      mes: fecha.toLocaleDateString("es-CL", { month: "long", year: "numeric" }),
      cuota: compromisoMensual,
    };
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "720px", margin: "0 auto" }}>
      <h2>🧮 Simulador de Créditos</h2>

      <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
        <label>
          Monto solicitado
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>

        <label>
          Número de cuotas
          <input
            type="number"
            value={cuotas}
            onChange={(e) => setCuotas(Number(e.target.value))}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>

        <label>
          Valor de la cuota
          <input
            type="number"
            value={valorCuota}
            onChange={(e) => setValorCuota(Number(e.target.value))}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>
      </div>

      <h3 style={{ marginTop: "1rem" }}>📊 Resultados</h3>
      <ul style={{ lineHeight: 1.8 }}>
        <li><strong>Total solicitado:</strong> {formatearMoneda(m, pais)}</li>
        <li><strong>Total a pagar:</strong> {formatearMoneda(totalPagar, pais)}</li>
        <li><strong>Intereses (en pesos):</strong> {formatearMoneda(intereses, pais)}</li>
        <li><strong>Intereses (% sobre el monto):</strong> {interesPct.toFixed(2)}%</li>
        <li><strong>Compromiso mensual total:</strong> {formatearMoneda(compromisoMensual, pais)}</li>
        <li><strong>Fecha de término:</strong> {fechaFin}</li>
      </ul>

      <h3 style={{ marginTop: "1rem" }}>📅 Proyección próximos 6 meses</h3>
      <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Cuota total a pagar</th>
          </tr>
        </thead>
        <tbody>
          {proyeccion6Meses.map((p, i) => (
            <tr key={i}>
              <td>{p.mes}</td>
              <td>{formatearMoneda(p.cuota, pais)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimuladorCreditos;
