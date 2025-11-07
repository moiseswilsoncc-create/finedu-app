import React from "react";

interface Props {
  categoria: string;
  categoriasDisponibles: string[];
  item: string;
  itemsDisponibles: string[];
  monto: number | "";
  fecha: string;
  // Usamos 'descripcion' como estado del campo, pero visualmente es "Forma de Pago"
  descripcion: string;
  editando: any;
  mensaje: string;
  error: string;
  setCategoria: (val: string) => void;
  setItem: (val: string) => void;
  setMonto: (val: number | "") => void;
  setFecha: (val: string) => void;
  setDescripcion: (val: string) => void;
  onAgregarCategoria: () => void;
  onAgregarItem: () => void;
  onGuardar: (e: React.FormEvent) => void;
  onSeleccionarCategoria: (cat: string) => void;
  onEditarCategoria: (nombre: string) => void;
  onEliminarCategoria: (nombre: string) => void;
  onEditarItem: (nombre: string) => void;
  onEliminarItem: (nombre: string) => void;
}

const FormularioEgreso: React.FC<Props> = ({
  categoria,
  categoriasDisponibles,
  item,
  itemsDisponibles,
  monto,
  fecha,
  descripcion,
  editando,
  mensaje,
  error,
  setCategoria,
  setItem,
  setMonto,
  setFecha,
  setDescripcion,
  onAgregarCategoria,
  onAgregarItem,
  onGuardar,
  onSeleccionarCategoria,
  onEditarCategoria,
  onEliminarCategoria,
  onEditarItem,
  onEliminarItem,
}) => {
  return (
    <form onSubmit={onGuardar} style={{ marginBottom: "2rem" }}>
      <h3>{editando ? "✏️ Editar Egreso" : "➕ Nuevo Egreso"}</h3>

      {/* Bloque 1: campos del egreso */}
      <div>
        <label>Categoría:</label>
        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            onSeleccionarCategoria(e.target.value);
          }}
        >
          <option value="">Seleccione</option>
          {categoriasDisponibles.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Ítem:</label>
        <select value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="">Seleccione</option>
          {itemsDisponibles.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Monto:</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>

      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      {/* Forma de Pago: reemplaza el campo "Descripción" */}
      <div>
        <label>Forma de Pago:</label>
        <select
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Débito">Débito</option>
          <option value="Crédito">Crédito</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>

      <button type="submit" style={{ marginTop: "0.75rem" }}>
        {editando ? "Guardar cambios" : "Guardar egreso"}
      </button>

      {/* Bloque 2: acciones de catálogo */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={onAgregarCategoria}>➕ Agregar Categoría</button>
        <button type="button" onClick={onAgregarItem}>➕ Agregar Ítem</button>
        <button type="button" onClick={() => categoria && onEditarCategoria(categoria)}>✏️ Editar Categoría</button>
        <button type="button" onClick={() => categoria && onEliminarCategoria(categoria)}>🗑️ Eliminar Categoría</button>
        <button type="button" onClick={() => item && onEditarItem(item)}>✏️ Editar Ítem</button>
        <button type="button" onClick={() => item && onEliminarItem(item)}>🗑️ Eliminar Ítem</button>
      </div>

      {mensaje && <p style={{ color: "green", marginTop: "0.5rem" }}>{mensaje}</p>}
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </form>
  );
};

export default FormularioEgreso;
