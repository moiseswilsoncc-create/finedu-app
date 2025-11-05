// src/components/ResumenEgresos.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { formatearMoneda } from "../utils/formatearMoneda";

interface ResumenItem {
  categoria: string;
  item: string;
  total: number;
}

const ResumenEgresos: React.FC<{ pais: string }> = ({ pais }) => {
  const [resumen, setResumen] = useState<ResumenItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filtros de período
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1); // enero = 1
  const [anio, setAnio] = useState(hoy.getFullYear());

  const cargarResumen = async () => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) return;

    // Rango de fechas según mes/año
    const primerDia = new Date(anio, mes - 1, 1);
    const ultimoDia = new Date(anio, mes, 0);

    const { data, error } = await supabase
      .from("egresos")
      .select(`
        monto,
        fecha,
        item_id,
        items_egresos (
          nombre,
          categoria_id,
          categorias_egresos ( nombre )
        )
      `)
      .eq("usuario_id", usuarioId)
      .gte("fecha", primerDia.toISOString())
      .lte("fecha", ultimoDia.toISOString());

    if (error) {
      console.error(error.message);
      setError("No se pudo cargar el resumen de egresos.");
      return;
    }

    // Agrupar por categoría e ítem
    const agrupado: { [key: string]: { [key: string]: number } } = {};
    (data || []).forEach((e: any) => {
      const categoria = e.items_egresos?.categorias_egresos?.nombre || "Sin categoría";
      const item = e.items_egresos?.nombre || "Sin ítem";
      const monto = e.monto ?? 0;

      if (!agrupado[categoria]) agrupado[categoria] = {};
      if (!agrupado[categoria][item]) agrupado[categoria][item] = 0;

      agrupado[categoria][item] += monto;
    });

    const resumenFinal: ResumenItem[] = [];
    Object.entries(agrupado).forEach(([categoria, items]) => {
      Object.entries(items).forEach(([item, total]) => {
        resumenFinal.push({ categoria, item, total });
      });
    });

    // Ordenar por categoría y monto descendente
    resumenFinal.sort((a, b) =>
      a.categoria === b.categoria
        ? b.total - a.total
        : a.categoria.localeCompare(b.categoria)
    );

    setResumen(resumenFinal);
  };

  useEffect(() => {
    cargarResumen();
  }, [mes, anio, pais]);

  // Calcular totales por categoría
  const totalesPorCategoria = resumen.reduce((acc, r) => {
    acc[r.categoria] = (acc[r.categoria] || 0) + r.total;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Resumen de Egresos</h2>
      <p>Totales agrupados por categoría e ítem, filtrados por mes y año.</p>

      {/* Filtros */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Mes: </label>
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("es-CL", { month: "long" })}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Año: </label>
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(Number(e.target.value))}
          style={{ width: "6rem" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resumen.length === 0 ? (
        <p>No hay egresos registrados en este período.</p>
      ) : (
        <>
          {/* Totales por categoría */}
          <h3>📌 Totales por categoría</h3>
          <ul>
            {Object.entries(totalesPorCategoria).map(([categoria, total]) => (
              <li key={categoria}>
                <strong>{categoria}:</strong> {formatearMoneda(total, pais)}
              </li>
            ))}
          </ul>

          {/* Detalle por ítem */}
          <h3 style={{ marginTop: "1rem" }}>📌 Detalle por ítem</h3>
          <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Ítem</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {resumen.map((r, i) => (
                <tr key={i}>
                  <td>{r.categoria}</td>
                  <td>{r.item}</td>
                  <td>{formatearMoneda(r.total, pais)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ResumenEgresos;
