import React from "react";

interface Props {
  categoria: string;
  categoriasDisponibles: string[];
  nuevoCategoria: string;
  item: string;
  itemsDisponibles: string[];
  nuevoItem: string;
  monto: number | "";
  fecha: string;
  descripcion: string;
  editando: any;
  mensaje: string;
  error: string;
  setCategoria: (val: string) => void;
  setNuevoCategoria: (val: string) => void;
  setItem: (val: string) => void;
  setNuevoItem: (val: string) => void;
  setMonto: (val: number | "") => void;
  setFecha: (val: string) => void;
  setDescripcion: (val: string) => void;
  onAgregarCategoria: () => void;
  onAgregarItem: () => void;
  onGuardar: (e: React.FormEvent) => void;
}

const FormularioEgreso: React.FC<Props> = ({
  categoria,
  categoriasDisponibles,
  nuevoCategoria,
  item,
  itemsDisponibles,
  nuevoItem,
  monto,
  fecha,
  descripcion,
  editando,
  mensaje,
  error,
  setCategoria,
  setNuevoCategoria,
  setItem,
  setNuevoItem,
  setMonto,
  setFecha,
  setDescripcion,
  onAgregarCategoria,
  onAgregarItem,
  onGuardar,
}) => {
  return (
    <form onSubmit={onGuardar} style={{ marginBottom: "1.5rem" }}>
      {/* Campo para agregar nueva categoría */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
        <input
          type="text"
          placeholder="Agregar nueva categoría"
          value={nuevoCategoria}
          onChange={(e) => setNuevoCategoria(e.target.value)}
        />
        <button type="button" onClick={onAgregarCategoria}>➕ Categoría</button>
      </div>

      {/* Campo para agregar nuevo ítem */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
        <input
          type="text"
          placeholder="Agregar nuevo ítem"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
        />
        <button type="button" onClick={onAgregarItem}>➕ Ítem</button>
      </div>

      {/* Selector de categoría */}
      <div>
        <label>Categoría: </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          disabled={!!editando}
        >
          <option value="">-- Selecciona --</option>
          {categoriasDisponibles.map((c, index) => (
            <option key={index} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Selector de ítem */}
      <div>
        <label>Ítem: </label>
        <select
          value={item}
          onChange={(e) => setItem(e.target.value)}
          required
        >
          <option value="">-- Selecciona --</option>
          {itemsDisponibles.map((i, index) => (
            <option key={index} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {/* Monto */}
      <div>
        <label>Monto: </label>
        <input
          type="number"
          value={monto}
          onChange={(e) => {
            const v = e.target.value;
            setMonto(v === "" ? "" : Number(v));
          }}
          placeholder="Ej: 50000"
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

      {/* Descripción */}
      <div>
        <label>Descripción: </label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Opcional"
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
