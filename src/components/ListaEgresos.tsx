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
}

const ListaEgresos: React.FC<Props> = ({
  egresos,
  seleccionados,
  toggleSeleccion,
  handleEditarSeleccionado,
  handleEliminarSeleccionados,
  total,
}) => {
  // 🔹 Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroItem, setFiltroItem] = useState("");
  const [filtroMontoMin, setFiltroMontoMin] = useState("");
  const [filtroMontoMax, setFiltroMontoMax] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");

  // 🔹 Aplicar filtros
  const egresosFiltrados = egresos.filter((e) => {
    const fechaObj = new Date(e.fecha);
    const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
    const anio = String(fechaObj.getFullYear());

    const cumpleCategoria =
      filtroCategoria === "" ||
      e.categoria_nombre.toLowerCase().includes(filtroCategoria.toLowerCase());

    const cumpleItem =
      filtroItem === "" ||
      e.item_nombre.toLowerCase().includes(filtroItem.toLowerCase());

    const cumpleMontoMin =
      filtroMontoMin === "" || e.monto >= Number(filtroMontoMin);

    const cumpleMontoMax =
      filtroMontoMax === "" || e.monto <= Number(filtroMontoMax);

    const cumpleFecha =
      filtroFecha === "" || e.fecha.startsWith(filtroFecha);

    const cumpleMes = filtroMes === "" || mes === filtroMes;
    const cumpleAnio = filtroAnio === "" || anio === filtroAnio;

    return (
      cumpleCategoria &&
      cumpleItem &&
      cumpleMontoMin &&
      cumpleMontoMax &&
      cumpleFecha &&
      cumpleMes &&
      cumpleAnio
    );
  });

  return (
    <div>
      <h3>📋 Lista de Egresos</h3>

      {/* 🔹 Bloque de filtros */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Filtrar por categoría"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por ítem"
          value={filtroItem}
          onChange={(e) => setFiltroItem(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monto mín"
          value={filtroMontoMin}
          onChange={(e) => setFiltroMontoMin(e.target.value)}
          style={{ width: "6rem" }}
        />
        <input
          type="number"
          placeholder="Monto máx"
          value={filtroMontoMax}
          onChange={(e) => setFiltroMontoMax(e.target.value)}
          style={{ width: "6rem" }}
        />
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
          <option value="">Mes</option>
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          <option value="03">Marzo</option>
          <option value="04">Abril</option>
          <option value="05">Mayo</option>
          <option value="06">Junio</option>
          <option value="07">Julio</option>
          <option value="08">Agosto</option>
          <option value="09">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
        <select
          value={filtroAnio}
          onChange={(e) => setFiltroAnio(e.target.value)}
        >
          <option value="">Año</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* 🔹 Tabla */}
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
