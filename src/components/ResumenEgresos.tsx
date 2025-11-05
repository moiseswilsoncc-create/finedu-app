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

  useEffect(() => {
    const cargarResumen = async () => {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) return;

      const { data, error } = await supabase
        .from("egresos")
        .select(`
          monto,
          item_id,
          items_egresos (
            nombre,
            categoria_id,
            categorias_egresos ( nombre )
          )
        `)
        .eq("usuario_id", usuarioId);

      if (error) {
        console.error(error.message);
        setError("No se pudo cargar el resumen de egresos.");
        return;
      }

      // Transformar datos
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

      setResumen(resumenFinal);
    };

    cargarResumen();
  }, [pais]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Resumen de Egresos</h2>
      <p>Totales agrupados por categoría e ítem.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resumen.length === 0 ? (
        <p>No hay egresos registrados.</p>
      ) : (
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
      )}
    </div>
  );
};

export default ResumenEgresos;
