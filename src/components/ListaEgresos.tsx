import React from "react";

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
  const egresosFiltrados = egresos.filter((e) => {
    return (
      (mesFiltro === "" || e.fecha.slice(5, 7) === mesFiltro) &&
      (anioFiltro === "" || e.fecha.slice(0, 4) === anioFiltro) &&
      (categoriaFiltro === "" || e.categoria_nombre.toLowerCase().includes(categoriaFiltro.toLowerCase())) &&
      (itemFiltro === "" || e.item_nombre.toLowerCase().includes(itemFiltro.toLowerCase())) &&
      (montoMin === "" || e.monto >= Number(montoMin)) &&
      (montoMax === "" || e.monto <= Number(montoMax))
    );
  });

  return (
    <div>
      <h3>📋 Lista de Egresos</h3>

      {/* Filtros en una sola línea */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label>Mes</label>
          <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
            <option value="">Todos</option>
            {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => (
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
