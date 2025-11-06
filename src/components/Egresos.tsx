// src/components/FormularioEgreso.tsx
import React from "react";

interface Props {
  categorias: { id: string; categoria: string }[];
  itemsCategoria: { id: string; item: string }[];
  egresos: any[];
  categoria: string;
  item: string;
  monto: number | "";
  fecha: string;
  descripcion: string;
  nuevoItem: string;
  editando: any;
  mensaje: string;
  error: string;
  onAgregarItem: () => void;
  onGuardar: (e: React.FormEvent) => void;
  setCategoria: (val: string) => void;
  setItem: (val: string) => void;
  setMonto: (val: number) => void;
  setFecha: (val: string) => void;
  setDescripcion: (val: string) => void;
  setNuevoItem: (val: string) => void;
  cargarItemsCategoria: (cat: string) => void;
}

const FormularioEgreso: React.FC<Props> = ({
  categorias, itemsCategoria, egresos,
  categoria, item, monto, fecha, descripcion, nuevoItem,
  editando, mensaje, error,
  onAgregarItem, onGuardar,
  setCategoria, setItem, setMonto, setFecha, setDescripcion, setNuevoItem,
  cargarItemsCategoria
}) => {
  return (
    <form onSubmit={onGuardar} style={{ marginBottom: "1.5rem" }}>
      {/* Botones iniciales */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button type="button" onClick={() => {
          setCategoria(""); setItem(""); setMonto(0); setFecha(""); setDescripcion(""); setNuevoItem("");
        }}>
          ➕ Agregar nuevo egreso
        </button>
        <button type="button" onClick={() => {
          if (!categoria) alert("Selecciona una categoría antes de agregar ítem.");
        }}>
          ➕ Agregar nuevo ítem
        </button>
      </div>

      {/* Selector de egresos registrados */}
      <div>
        <label>Selecciona egreso registrado: </label>
        <select value={editando ? editando.id : ""}>
          <option value="">-- Selecciona --</option>
          {egresos.map((eg) => (
            <option key={eg.id} value={eg.id}>
              {eg.categoria} — {eg.item} — ${eg.monto}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de categoría */}
      <div>
        <label>Categoría: </label>
        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            cargarItemsCategoria(e.target.value);
          }}
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
        <select value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="">-- Selecciona --</option>
          {itemsCategoria.map((it) => (
            <option key={it.id} value={it.item}>{it.item}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nuevo ítem"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
        />
        <button type="button" onClick={onAgregarItem}>➕ Agregar ítem</button>
      </div>

      {/* Monto, fecha, descripción */}
      <input type="number" value={monto} onChange={(e) => setMonto(Number(e.target.value))} />
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <button type="submit">
        {editando ? "✏️ Guardar Cambios" : "➕ Agregar Egreso"}
      </button>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default FormularioEgreso;
