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
  descripcion: string; // ahora representa Forma de Pago
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
}) => {
  return (
    <form onSubmit={onGuardar} style={{ marginBottom: "2rem" }}>
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
      </div>

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
      </div>

      <div>
        <label>Monto:</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
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
