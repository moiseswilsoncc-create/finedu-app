// src/components/FormularioEgreso.tsx
import React from "react";

interface Props {
  categorias: { id: string; categoria: string }[];
  itemsCategoria: { id: string; item: string }[];
  categoria: string;
  item: string;
  nuevaCategoria: string;
  nuevoItem: string;
  mensaje: string;
  error: string;
  onAgregarCategoria: () => void;
  onAgregarItem: () => void;
  setCategoria: (val: string) => void;
  setItem: (val: string) => void;
  setNuevaCategoria: (val: string) => void;
  setNuevoItem: (val: string) => void;
}

const FormularioEgreso: React.FC<Props> = ({
  categorias, itemsCategoria,
  categoria, item,
  nuevaCategoria, nuevoItem,
  mensaje, error,
  onAgregarCategoria, onAgregarItem,
  setCategoria, setItem, setNuevaCategoria, setNuevoItem
}) => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Botones arriba */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
        />
        <button type="button" onClick={onAgregarCategoria}>➕ Agregar categoría</button>

        <input
          type="text"
          placeholder="Nuevo ítem"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
        />
        <button type="button" onClick={onAgregarItem}>➕ Agregar ítem</button>
      </div>

      {/* Selector de categoría */}
      <div>
        <label>Categoría: </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
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
          onChange={(e) => setItem(e.target.value)}
          required
        >
          <option value="">-- Selecciona --</option>
          {itemsCategoria.map((it) => (
            <option key={it.id} value={it.item}>{it.item}</option>
          ))}
        </select>
      </div>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FormularioEgreso;
