// src/components/ListaEgresos.tsx
import React from "react";

interface Egreso {
  id: string;
  categoria: string;
  item: string;
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
}

const ListaEgresos: React.FC<Props> = ({
  egresos, seleccionados, toggleSeleccion,
  handleEditarSeleccionado, handleEliminarSeleccionados
}) => {
  const total = egresos.reduce((acc, e) => acc + e.monto, 0);

  return (
    <>
      <h3>📋 Lista de Egresos</h3>
      {egresos.length === 0 ? (
        <p>No hay egresos registrados aún.</p>
      ) : (
        <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th scope="col">✔️</th>
              <th scope="col">Categoría</th>
              <th scope="col">Ítem</th>
              <th scope="col">Monto</th>
              <th scope="col">Fecha</th>
              <th scope="col">Descripción</th>
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
                    aria-label={`Seleccionar egreso ${e.item}`}
                  />
                </td>
                <td>{e.categoria}</td>
                <td>{e.item}</td>
                <td>${e.monto.toLocaleString("es-CL")}</td>
                <td>{new Date(e.fecha).toLocaleDateString("es-CL")}</td>
                <td>{e.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleEditarSeleccionado}>✏️ Editar seleccionado</button>
        <button onClick={handleEliminarSeleccionados}>🗑️ Eliminar seleccionados</button>
      </div>

      <h4 style={{ marginTop: "1rem" }}>
        💵 Total: ${total.toLocaleString("es-CL")}
      </h4>
    </>
  );
};

export default ListaEgresos;
