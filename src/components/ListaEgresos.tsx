// src/components/ListaEgresos.tsx
import React from "react";

interface Props {
  egresos: any[];
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
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>✔️</th>
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
                <td>{e.categoria}</td>
                <td>{e.item}</td>
                <td>${e.monto.toLocaleString("es-CL")}</td>
                <td>{e.fecha}</td>
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
