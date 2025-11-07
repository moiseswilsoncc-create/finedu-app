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
  descripcion: string; // Forma de Pago
  editando: any;
  mensaje: string;
  error: string;
  setCategoria: (c: string) => void;
  setNuevoCategoria: (c: string) => void;
  setItem: (i: string) => void;
  setNuevoItem: (i: string) => void;
  setMonto: (m: number | "") => void;
  setFecha: (f: string) => void;
  setDescripcion: (d: string) => void;
  onAgregarCategoria: () => void;
  onAgregarItem: () => void;
  onGuardar: (e: React.FormEvent) => void;
  onSeleccionarCategoria: (c: string) => void;

  // 🔹 nuevas props para editar/borrar
  onEditarCategoria?: (nombre: string) => void;
  onEliminarCategoria?: (nombre: string) => void;
  onEditarItem?: (nombre: string) => void;
  onEliminarItem?: (nombre: string) => void;
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
  onSeleccionarCategoria,
  onEditarCategoria,
  onEliminarCategoria,
  onEditarItem,
  onEliminarItem,
}) => {
  return (
    <form onSubmit={onGuardar} style={{ marginBottom: "2rem" }}>
      {/* Categorías */}
      <div>
        <label>Categoría:</label>
        <select
          value={categoria}
          onChange={(e) => {
            const nuevaCategoria = e.target.value;
            setCategoria(nuevaCategoria);
            onSeleccionarCategoria(nuevaCategoria);
          }}
        >
          <option value="">Seleccione categoría</option>
          {categoriasDisponibles.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nueva categoría"
          value={nuevoCategoria}
          onChange={(e) => setNuevoCategoria(e.target.value)}
        />
        <button type="button" onClick={onAgregarCategoria}>➕ Agregar Categoría</button>

        {/* 🔹 Botones únicos para la categoría seleccionada */}
        {categoria && (
          <div style={{ marginTop: "0.5rem" }}>
            <button type="button" onClick={() => onEditarCategoria?.(categoria)}>✏️ Editar</button>
            <button type="button" onClick={() => onEliminarCategoria?.(categoria)}>🗑️ Eliminar</button>
          </div>
        )}
      </div>

      {/* Ítems */}
      <div>
        <label>Ítem:</label>
        <select
          value={item}
          onChange={(e) => setItem(e.target.value)}
        >
          <option value="">Seleccione ítem</option>
          {itemsDisponibles.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nuevo ítem"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
        />
        <button type="button" onClick={onAgregarItem}>➕ Agregar Ítem</button>

        {/* 🔹 Botones únicos para el ítem seleccionado */}
        {item && (
          <div style={{ marginTop: "0.5rem" }}>
            <button type="button" onClick={() => onEditarItem?.(item)}>✏️ Editar</button>
            <button type="button" onClick={() => onEliminarItem?.(item)}>🗑️ Eliminar</button>
          </div>
        )}
      </div>

      {/* Monto */}
      <div>
        <label>Monto:</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
        />
      </div>

      {/* Fecha */}
      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      {/* Forma de pago */}
      <div>
        <label>Forma de Pago:</label>
        <select
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        >
          <option value="">Seleccione forma de pago</option>
          <option value="efectivo">Efectivo</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
          <option value="transferencia">Transferencia</option>
          <option value="cheque">Cheque</option>
        </select>
      </div>

      <button type="submit">{editando ? "✏️ Actualizar" : "💾 Guardar"}</button>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default FormularioEgreso;
