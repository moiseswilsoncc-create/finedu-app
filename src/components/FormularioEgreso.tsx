// src/components/FormularioEgreso.tsx
import React from "react";

interface Props {
  categorias: { id: string; categoria: string }[];
  itemsCategoria: { id: string; item: string }[];
  categoria: string;
  item: string;
  monto: number | "";
  fecha: string;
  nuevoItem: string;
  nuevaCategoria: string;
  editando: any;
  mensaje: string;
  error: string;
  onAgregarCategoria: () => void;
  onAgregarItem: () => void;
  onGuardar: (e: React.FormEvent) => void;
  setCategoria: (val: string) => void;
  setItem: (val: string) => void;
  setMonto: (val: number) => void;
  setFecha: (val: string) => void;
  setNuevoItem: (val: string) => void;
  setNuevaCategoria: (val: string) => void;
  cargarItemsCategoria: (cat: string) => void;
}

const FormularioEgreso: React.FC<Props> = ({
  categorias, itemsCategoria,
  categoria, item, monto, fecha,
  nuevoItem, nuevaCategoria,
  editando, mensaje, error,
  onAgregarCategoria, onAgregarItem, onGuardar,
  setCategoria, setItem, setMonto, setFecha,
  setNuevoItem, setNuevaCategoria,
  cargarItemsCategoria
}) => {
  return (
    <form onSubmit={onGuardar} style={{ marginBottom: "1.5rem" }}>
      {/* Botones arriba */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
        />
        <button type="button" onClick={onAgregarCategoria}>
          ➕ Agregar categoría
        </button>

        <input
          type="text"
          placeholder="Nuevo ítem"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
        />
        <button type="button" onClick={onAgregarItem}>
          ➕ Agregar ítem
        </button>
      </div>

      {/* Selector de categoría */}
      <div>
        <label>Categoría: </label>
        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            cargarItemsCategoria(e.target.value); // conecta categoría con ítems
          }}
          required
        >
          <option value="">-- Selecciona --</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.categoria}>{c.categoria}</option>
          ))}
        </select>
      </div>

      {/* Selector de ítems */}
      <div>
        <label>Ítem: </label>
        <select
          value={item}
          onChange={(e) => setItem(e.target.value)} // conecta ítem con estado
          required
        >
          <option value="">-- Selecciona --</option>
          {itemsCategoria.map((it) => (
            <option key={it.id} value={it.item}>{it.item}</option>
          ))}
        </select>
      </div>

      {/* Monto */}
      <div>
        <label>Monto: </label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          min={0}
          required
        />
      </div>

      {/* Fecha */}
      <div>
        <label>Fecha: </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>

      <button type="submit">
        {editando ? "✏️ Guardar Cambios" : "➕ Agregar Egreso"}
      </button>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default FormularioEgreso;
