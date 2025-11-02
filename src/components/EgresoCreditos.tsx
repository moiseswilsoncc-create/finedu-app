import React, { useState } from "react";

interface Credito {
  fecha: string;
  tipo: string;
  contado: number;
  credito: number;
  cuotas: number;
  valorCuota: number;
  totalCredito: number;
  diferencia: number;
  porcentaje: number;
  tasaMensual: number;
  tasaAnual: number;
  fechaTermino: string;
}

const EgresoCreditos: React.FC = () => {
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("");
  const [contado, setContado] = useState<number | "">("");
  const [credito, setCredito] = useState<number | "">("");
  const [cuotas, setCuotas] = useState<number | "">("");
  const [valorCuota, setValorCuota] = useState<number | "">("");
  const [creditos, setCreditos] = useState<Credito[]>([]);

  // Calcular tasa interna de retorno aproximada (TIR mensual)
  const calcularTasaMensual = (credito: number, cuota: number, n: number): number => {
    let tasa = 0.02; // 2% inicial
    for (let i = 0; i < 100; i++) {
      const vp = cuota * (1 - Math.pow(1 + tasa, -n)) / tasa;
      const error = credito - vp;
      if (Math.abs(error) < 0.01) break;
      tasa += error / (credito * n);
    }
    return tasa;
  };

  const handleAgregarCredito = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha || !tipo || !contado || !credito || !cuotas || !valorCuota) return;

    const totalCredito = Number(cuotas) * Number(valorCuota);
    const diferencia = totalCredito - Number(contado);
    const porcentaje = (diferencia / Number(contado)) * 100;

    const tasaMensual = calcularTasaMensual(Number(credito), Number(valorCuota), Number(cuotas));
    const tasaAnual = Math.pow(1 + tasaMensual, 12) - 1;

    const fechaInicio = new Date(fecha);
    const fechaTermino = new Date(fechaInicio);
    fechaTermino.setMonth(fechaInicio.getMonth() + Number(cuotas));

    const nuevoCredito: Credito = {
      fecha,
      tipo,
      contado: Number(contado),
      credito: Number(credito),
      cuotas: Number(cuotas),
      valorCuota: Number(valorCuota),
      totalCredito,
      diferencia,
      porcentaje,
      tasaMensual,
      tasaAnual,
      fechaTermino: fechaTermino.toISOString().split("T")[0],
    };

    setCreditos([...creditos, nuevoCredito]);

    setFecha("");
    setTipo("");
    setContado("");
    setCredito("");
    setCuotas("");
    setValorCuota("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💳 Créditos y Deudas</h2>
      <p>Registra tus créditos y descubre el costo real de tu deuda.</p>

      <form onSubmit={handleAgregarCredito} style={{ marginBottom: "1.5rem" }}>
        <div>
          <label>Fecha: </label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        </div>

        <div>
          <label>Tipo de deuda: </label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">-- Selecciona --</option>
            <option value="Tarjeta Comercial">Tarjeta Comercial</option>
            <option value="Tarjeta Bancaria">Tarjeta Bancaria</option>
            <option value="Crédito de Consumo">Crédito de Consumo</option>
            <option value="Crédito Hipotecario">Crédito Hipotecario</option>
            <option value="Crédito Automotriz">Crédito Automotriz</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label>Monto contado: </label>
          <input type="number" value={contado} onChange={(e) => setContado(Number(e.target.value))} required />
        </div>

        <div>
          <label>Valor crédito: </label>
          <input type="number" value={credito} onChange={(e) => setCredito(Number(e.target.value))} required />
        </div>

        <div>
          <label>Número de cuotas: </label>
          <input type="number" value={cuotas} onChange={(e) => setCuotas(Number(e.target.value))} required />
        </div>

        <div>
          <label>Valor de la cuota: </label>
          <input type="number" value={valorCuota} onChange={(e) => setValorCuota(Number(e.target.value))} required />
        </div>

        <button type="submit">➕ Agregar Crédito</button>
      </form>

      <h3>📋 Créditos registrados</h3>
      {creditos.length === 0 ? (
        <p>No hay créditos registrados aún.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Contado</th>
              <th>Crédito</th>
              <th>Cuotas</th>
              <th>Valor Cuota</th>
              <th>Total Crédito</th>
              <th>Diferencia</th>
              <th>% Extra</th>
              <th>Tasa Mensual</th>
              <th>Tasa Anual</th>
              <th>Fecha Término</th>
            </tr>
          </thead>
          <tbody>
            {creditos.map((c, i) => (
              <tr key={i}>
                <td>{c.fecha}</td>
                <td>{c.tipo}</td>
                <td>${c.contado.toLocaleString("es-CL")}</td>
                <td>${c.credito.toLocaleString("es-CL")}</td>
                <td>{c.cuotas}</td>
                <td>${c.valorCuota.toLocaleString("es-CL")}</td>
                <td>${c.totalCredito.toLocaleString("es-CL")}</td>
                <td>${c.diferencia.toLocaleString("es-CL")}</td>
                <td>{c.porcentaje.toFixed(2)}%</td>
                <td>{(c.tasaMensual * 100).toFixed(2)}%</td>
                <td>{(c.tasaAnual * 100).toFixed(2)}%</td>
                <td>{c.fechaTermino}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EgresoCreditos;
