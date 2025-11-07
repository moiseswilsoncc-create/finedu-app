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
    <form onSubmit={onGuardar} style={{ marginBottom: "2rem" }}>
      <h3>{editando ? "✏️ Editar egreso" : "➕ Nuevo egreso"}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      <div>
        <label>Categoría:</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
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
        <button type="button" onClick={onAgregarCategoria}>Agregar categoría</button>
      </div>

      <div>
        <label>Ítem:</label>
        <select
          value={item}
          onChange={(e) => setItem(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
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
        <button type="button" onClick={onAgregarItem}>Agregar ítem</button>
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
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <button type="submit">{editando ? "Actualizar" : "Guardar"}</button>
    </form>
  );
};

export default FormularioEgreso;
