import React from "react";

interface Egreso {
  id: string;
  usuario_id: string;
  item_id: number;
  item_nombre: string;
  categoria_nombre: string;
  monto: number;
  fecha: string;
  descripcion?: string;
}

interface Props {
  egresos: Egreso[];
  seleccionados: string[];
  toggleSeleccion: (id: string) => void;
  handleEditarSeleccionado: () => void;
  handleEliminarSeleccionados: () => void;
  total: number;
}

const ListaEgresos: React.FC<Props> = ({
  egresos,
  seleccionados,
  toggleSeleccion,
  handleEditarSeleccionado,
  handleEliminarSeleccionados,
  total,
}) => {
  return (
    <div>
      <h3>📋 Lista de egresos</h3>
      <table border={1} cellPadding={8} style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Categoría</th>
            <th>Ítem</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {egresos.map((e) => (
            <tr key={e.id}>
              <td>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(e.id)}
                  onChange={() => toggleSeleccion(e.id)}
                />
              </td>
              <td>{e.categoria_nombre}</td>
              <td>{e.item_nombre}</td>
              <td>{e.monto}</td>
              <td>{e.fecha}</td>
              <td>{e.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "1rem" }}>💰 Total: {total}</p>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleEditarSeleccionado}>✏️ Editar seleccionado</button>
        <button onClick={handleEliminarSeleccionados}>🗑️ Eliminar seleccionados</button>
      </div>
    </div>
  );
};

export default ListaEgresos;
