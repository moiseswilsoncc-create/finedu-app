import React, { useState } from "react";

interface Ahorro {
  fechaInicio: string;
  tipo: string;
  monto: number;
  tasa?: number;
  plazoMeses?: number;
  montoFinal?: number;
  fechaFin?: string;
}

const AhorroPersonal: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [tipo, setTipo] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [tasa, setTasa] = useState<number | "">("");
  const [plazoMeses, setPlazoMeses] = useState<number | "">("");
  const [ahorros, setAhorros] = useState<Ahorro[]>([]);

  // Cálculo de monto final según tipo de ahorro
  const calcularMontoFinal = (
    tipo: string,
    monto: number,
    tasa?: number,
    plazoMeses?: number
  ): { montoFinal: number; fechaFin?: string } => {
    let montoFinal = monto;
    let fechaFin: string | undefined = undefined;

    if (tipo === "Ahorro con interés" && tasa && plazoMeses) {
      // Interés compuesto mensual
      const tasaMensual = tasa / 100 / 12;
      montoFinal = monto * Math.pow(1 + tasaMensual, plazoMeses);

      const inicio = new Date(fechaInicio);
      const fin = new Date(inicio);
      fin.setMonth(inicio.getMonth() + plazoMeses);
      fechaFin = fin.toISOString().split("T")[0];
    }

    if (tipo === "APV" && tasa && plazoMeses) {
      // Simulación similar a depósito a plazo con interés compuesto
      const tasaMensual = tasa / 100 / 12;
      montoFinal = monto * Math.pow(1 + tasaMensual, plazoMeses);

      const inicio = new Date(fechaInicio);
      const fin = new Date(inicio);
      fin.setMonth(inicio.getMonth() + plazoMeses);
      fechaFin = fin.toISOString().split("T")[0];
    }

    if (tipo === "Ahorro en UF" && plazoMeses) {
      // Aquí se podría integrar la variación real de la UF desde una API
      // Por ahora asumimos un 3% anual de reajuste
      const tasaMensual = 0.03 / 12;
      montoFinal = monto * Math.pow(1 + tasaMensual, plazoMeses);

      const inicio = new Date(fechaInicio);
      const fin = new Date(inicio);
      fin.setMonth(inicio.getMonth() + plazoMeses);
      fechaFin = fin.toISOString().split("T")[0];
    }

    return { montoFinal, fechaFin };
  };

  const handleAgregarAhorro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaInicio || !tipo || !monto) return;

    const { montoFinal, fechaFin } = calcularMontoFinal(
      tipo,
      Number(monto),
      tasa ? Number(tasa) : undefined,
      plazoMeses ? Number(plazoMeses) : undefined
    );

    const nuevoAhorro: Ahorro = {
      fechaInicio,
      tipo,
      monto: Number(monto),
      tasa: tasa ? Number(tasa) : undefined,
      plazoMeses: plazoMeses ? Number(plazoMeses) : undefined,
      montoFinal,
      fechaFin,
    };

    setAhorros([...ahorros, nuevoAhorro]);

    // Reset form
    setFechaInicio("");
    setTipo("");
    setMonto("");
    setTasa("");
    setPlazoMeses("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💰 Ahorro e Inversión Personal</h2>
      <p>Registra tus ahorros y calcula su proyección en el tiempo.</p>

      <form onSubmit={handleAgregarAhorro} style={{ marginBottom: "1.5rem" }}>
        <div>
          <label>Fecha inicio: </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Tipo de ahorro: </label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">-- Selecciona --</option>
            <option value="Ahorro normal">Ahorro normal</option>
            <option value="Ahorro con interés">Ahorro con interés</option>
            <option value="Ahorro en UF">Ahorro en UF</option>
            <option value="APV">APV</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label>Monto: </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
          />
        </div>

        {(tipo === "Ahorro con interés" || tipo === "APV" || tipo === "Ahorro en UF") && (
          <>
            <div>
              <label>Tasa de interés (% anual): </label>
              <input
                type="number"
                value={tasa}
                onChange={(e) => setTasa(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Plazo (meses): </label>
              <input
                type="number"
                value={plazoMeses}
                onChange={(e) => setPlazoMeses(Number(e.target.value))}
              />
            </div>
          </>
        )}

        <button type="submit">➕ Agregar Ahorro</button>
      </form>

      <h3>📋 Ahorros registrados</h3>
      {ahorros.length === 0 ? (
        <p>No hay ahorros registrados aún.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Fecha inicio</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Tasa</th>
              <th>Plazo (meses)</th>
              <th>Monto final proyectado</th>
              <th>Fecha fin</th>
            </tr>
          </thead>
          <tbody>
            {ahorros.map((a, i) => (
              <tr key={i}>
                <td>{a.fechaInicio}</td>
                <td>{a.tipo}</td>
                <td>${a.monto.toLocaleString("es-CL")}</td>
                <td>{a.tasa ? `${a.tasa}%` : "-"}</td>
                <td>{a.plazoMeses ?? "-"}</td>
                <td>${a.montoFinal?.toLocaleString("es-CL")}</td>
                <td>{a.fechaFin ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AhorroPersonal;
