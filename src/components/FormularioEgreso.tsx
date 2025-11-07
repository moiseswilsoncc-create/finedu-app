import React from "react";

type Categoria = { id: string; categoria: string };
type ItemCat = { id: string; item: string };

interface Props {
  categorias: Categoria[];
  itemsCategoria: ItemCat[];
  categoria: string;
  item: string;
  monto: number | "";
  fecha: string;
  descripcion: string;
  nuevaCategoria: string;
  nuevoItem: string;
  editando: any;
  mensaje: string;
  error: string;
  onAgregarCategoria: () => void;
  onAgregarItem: () => void;
  onGuardar: (e: React.FormEvent) => void;
  onCancelarEdicion: () => void;
  setCategoria: (val: string) => void;
  setItem: (val: string) => void;
  setMonto: (val: number | "") => void;
  setFecha: (val: string) => void;
  setDescripcion: (val: string) => void;
  setNuevaCategoria: (val: string) => void;
  setNuevoItem: (val: string) => void;
}

const FormularioEgreso: React.FC<Props> = ({
  categorias,
  itemsCategoria,
  categoria,
  item,
  monto,
  fecha,
  descripcion,
  nuevaCategoria,
  nuevoItem,
  editando,
  mensaje,
  error,
  onAgregarCategoria,
  onAgregarItem,
  onGuardar,
  onCancelarEdicion,
  setCategoria,
  setItem,
  setMonto,
  setFecha,
  setDescripcion,
  setNuevaCategoria,
  setNuevoItem,
}) => {
  return (
    <form onSubmit={onGuardar} style={{ marginBottom: "1.5rem" }}>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
        />
        <button type="button" onClick={onAgregarCategoria}>➕ Agregar categoría</button>

        <input
          type="text"
          placeholder="Nuevo ítem (requiere categoría)"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
        />
        <button type="button" onClick={onAgregarItem}>➕ Agregar ítem</button>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Categoría:</label>
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

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Ítem:</label>
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

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        <div>
          <label style={{ marginRight: "0.5rem" }}>Monto:</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => {
              const v = e.target.value;
              setMonto(v === "" ? "" : Number(v));
            }}
            min={0}
            placeholder="Ej: 50000"
            required
          />
        </div>
        <div>
          <label style={{ marginRight: "0.5rem" }}>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", marginBottom: "0.25rem" }}>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Opcional"
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="submit">
          {editando ? "✏️ Guardar cambios" : "➕ Agregar egreso"}
        </button>
        {editando && (
          <button type="button" onClick={onCancelarEdicion}>
            🔁 Cancelar edición
          </button>
        )}
      </div>

      {mensaje && <p style={{ color: "green", marginTop: "0.5rem" }}>{mensaje}</p>}
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </form>
  );
};

export default FormularioEgreso;
