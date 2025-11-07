import React from "react";

interface Egreso {
  id: string;
  usuario_id: string;
  monto: number;
  fecha: string;
  forma_pago?: string;
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
  mesFiltro: string;
  anioFiltro: string;
  categoriaFiltro: string;
  itemFiltro: string;
  montoMin: number | "";
  montoMax: number | "";
  setMesFiltro: (val: string) => void;
  setAnioFiltro: (val: string) => void;
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
  mesFiltro,
  anioFiltro,
  categoriaFiltro,
  itemFiltro,
  montoMin,
  montoMax,
  setMesFiltro,
  setAnioFiltro,
  setCategoriaFiltro,
  setItemFiltro,
  setMontoMin,
  setMontoMax,
  usuarioId,
  cargarEgresos,
}) => {
  // Normaliza fecha (soporta YYYY-MM-DD y timestamps ISO)
  const parseFecha = (fecha: string) => {
    const d = new Date(fecha);
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = String(d.getFullYear());
    return { mes, anio };
  };

  const egresosFiltrados = egresos.filter((e) => {
    const { mes, anio } = parseFecha(e.fecha);
    const cat = (e.categoria_nombre || "").toLowerCase();
    const itm = (e.item_nombre || "").toLowerCase();
    const catFiltro = categoriaFiltro.trim().toLowerCase();
    const itmFiltro = itemFiltro.trim().toLowerCase();

    const pasaMes = mesFiltro === "" || mes === mesFiltro;
    const pasaAnio = anioFiltro === "" || anio === anioFiltro;
    const pasaCategoria = catFiltro === "" || cat.includes(catFiltro);
    const pasaItem = itmFiltro === "" || itm.includes(itmFiltro);
    const pasaMontoMin = montoMin === "" || e.monto >= Number(montoMin);
    const pasaMontoMax = montoMax === "" || e.monto <= Number(montoMax);

    return (
      pasaMes &&
      pasaAnio &&
      pasaCategoria &&
      pasaItem &&
      pasaMontoMin &&
      pasaMontoMax
    );
  });

  return (
    <div>
      <h3>📋 Lista de Egresos</h3>

      {/* Filtros en una sola línea */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div>
          <label>Mes</label>
          <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
            <option value="">Todos</option>
            {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Año</label>
          <input
            type="number"
            placeholder="2025"
            value={anioFiltro}
            onChange={(e) => setAnioFiltro(e.target.value)}
            style={{ width: "6rem" }}
          />
        </div>

        <div>
          <label>Categoría</label>
          <input
            type="text"
            placeholder="Categoría"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          />
        </div>

        <div>
          <label>Ítem</label>
          <input
            type="text"
            placeholder="Ítem"
            value={itemFiltro}
            onChange={(e) => setItemFiltro(e.target.value)}
          />
        </div>

        <div>
          <label>Monto</label>
          <input
            type="number"
            placeholder="mín"
            value={montoMin}
            onChange={(e) =>
              setMontoMin(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{ width: "6rem" }}
          />
          <input
            type="number"
            placeholder="máx"
            value={montoMax}
            onChange={(e) =>
              setMontoMax(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{ width: "6rem", marginLeft: "0.5rem" }}
          />
        </div>

        {/* El botón puede recargar datos del servidor si lo necesitas,
            pero el filtrado local ya se aplica en tiempo real */}
        <button type="button" onClick={() => usuarioId && cargarEgresos(usuarioId)}>
          🔍 Filtrar
        </button>
      </div>

      {/* Tabla */}
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
              <td>{egreso.forma_pago}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>Total:</strong> {total}</p>

      {/* Acciones */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" onClick={handleEditarSeleccionado}>✏️ Editar</button>
        <button type="button" onClick={handleEliminarSeleccionados}>🗑️ Eliminar</button>
      </div>
    </div>
  );
};

export default ListaEgresos;
