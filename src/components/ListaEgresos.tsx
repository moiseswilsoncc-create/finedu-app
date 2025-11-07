import React, { useState } from "react";

interface Egreso {
  id: string;
  usuario_id: string;
  monto: number;
  fecha: string;
  descripcion?: string;
  item_nombre: string;
  categoria_nombre: string;
}

interface Props {
  egresos: Egreso[];
  seleccionados: string[];
  toggleSeleccion: (id: string) => void;
  handleEditarSeleccionado: () => void;
  handleEliminarSeleccionados: () => void;
  total: number;
  categoriaFiltro: string;
  itemFiltro: string;
  montoMin: number | "";
  montoMax: number | "";
  setCategoriaFiltro: (val: string) => void;
  setItemFiltro: (val: string) => void;
  setMontoMin: (val: number | "") => void;
  setMontoMax: (val: number | "") => void;
  usuarioId: string | null;
  cargarEgresos: (uid: string) => Promise<void>;
}

const ListaEgresos: React.FC<Props> = ({
  egresos,
  seleccionados,
  toggleSeleccion,
  handleEditarSeleccionado,
  handleEliminarSeleccionados,
  total,
  categoriaFiltro,
  itemFiltro,
  montoMin,
  montoMax,
  setCategoriaFiltro,
  setItemFiltro,
  setMontoMin,
  setMontoMax,
  usuarioId,
  cargarEgresos,
}) => {
  // 🔹 Filtros aplicados en la tabla
  const egresosFiltrados = egresos.filter((e) => {
    return (
      (categoriaFiltro === "" || e.categoria_nombre.toLowerCase().includes(categoriaFiltro.toLowerCase())) &&
      (itemFiltro === "" || e.item_nombre.toLowerCase().includes(itemFiltro.toLowerCase())) &&
      (montoMin === "" || e.monto >= Number(montoMin)) &&
      (montoMax === "" || e.monto <= Number(montoMax))
    );
  });

  return (
    <div>
      <h3>📋 Lista de Egresos</h3>

      {/* 🔹 Bloque de filtros */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Categoría"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ítem"
          value={itemFiltro}
          onChange={(e) => setItemFiltro(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monto mín"
          value={montoMin}
          onChange={(e) => setMontoMin(e.target.value === "" ? "" : Number(e.target.value))}
          style={{ width: "6rem" }}
        />
        <input
          type="number"
          placeholder="Monto máx"
          value={montoMax}
          onChange={(e) => setMontoMax(e.target.value === "" ? "" : Number(e.target.value))}
          style={{ width: "6rem" }}
        />
        <button
          type="button"
          onClick={() => usuarioId && cargarEgresos(usuarioId)}
        >
          🔍 Filtrar
        </button>
      </div>
      {/* 🔹 Tabla de egresos */}
      <table border={1} cellPadding={5} style={{ width: "100%", marginBottom: "1rem" }}>
        <thead>
          <tr>
            <th>✔</th>
            <th>Categoría</th>
            <th>Ítem</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Forma de Pago</th>
          </tr>
        </thead>
        <tbody>
          {egresosFiltrados.map((egreso) => (
            <tr key={egreso.id}>
              <td>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(egreso.id)}
                  onChange={() => toggleSeleccion(egreso.id)}
                />
              </td>
              <td>{egreso.categoria_nombre}</td>
              <td>{egreso.item_nombre}</td>
              <td>{egreso.monto}</td>
              <td>{egreso.fecha}</td>
              <td>{egreso.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Total:</strong> {total}</p>

      {/* 🔹 Botones de acción sobre egresos seleccionados */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" onClick={handleEditarSeleccionado}>✏️ Editar</button>
        <button type="button" onClick={handleEliminarSeleccionados}>🗑️ Eliminar</button>
      </div>
    </div>
  );
};
export default ListaEgresos;
