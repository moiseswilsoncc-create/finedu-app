import React from "react";

interface Egreso {
  id: string;
  usuario_id: string;
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
      <h3>📋 Lista de Egresos</h3>

      <div style={{ marginBottom: "0.75rem", display: "flex", gap: "0.75rem" }}>
        <button type="button" onClick={handleEditarSeleccionado}>✏️ Editar seleccionado</button>
        <button type="button" onClick={handleEliminarSeleccionados}>🗑️ Eliminar seleccionados</button>
      </div>

      {egresos.length === 0 ? (
        <p>No hay egresos registrados aún.</p>
      ) : (
        <table border={1} cellPadding={8} style={{ width: "100%" }}>
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
                <td>${Number(e.monto).toLocaleString("es-CL")}</td>
                <td>{e.fecha}</td>
                <td>{e.descripcion || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 style={{ marginTop: "1rem" }}>
        💸 Total: ${total.toLocaleString("es-CL")}
      </h4>
    </div>
  );
};

export default ListaEgresos;
