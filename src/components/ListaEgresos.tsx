import React from "react";

type Egreso = {
  id: string;
  usuario_id: string;
  categoria: string;
  item: string;
  monto: number;
  fecha: string;
  descripcion?: string;
};

interface Props {
  egresos: Egreso[];
  seleccionados: string[];
  toggleSeleccion: (id: string) => void;
  handleEditarSeleccionado: () => void;
  handleEliminarSeleccionados: () => void;
}

const ListaEgresos: React.FC<Props> = ({
  egresos,
  seleccionados,
  toggleSeleccion,
  handleEditarSeleccionado,
  handleEliminarSeleccionados,
}) => {
  const total = egresos.reduce((acc, e) => acc + (Number(e.monto) || 0), 0);

  return (
    <div>
      <h3>Lista de Egresos</h3>

      <div style={{ marginBottom: "0.75rem", display: "flex", gap: "0.75rem" }}>
        <button type="button" onClick={handleEditarSeleccionado}>✏️ Editar seleccionados</button>
        <button type="button" onClick={handleEliminarSeleccionados}>🗑️ Eliminar seleccionados</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th></th>
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
          {egresos.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "0.75rem" }}>
                Sin egresos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <p style={{ marginTop: "0.75rem", fontWeight: 600 }}>
        Total: ${total.toLocaleString("es-CL")}
      </p>
    </div>
  );
};

export default ListaEgresos;
