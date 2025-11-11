import React from "react";

interface Props {
  correos: string[];
  roles: { [correo: string]: "admin" | "participante" };
  montos: { [correo: string]: number };
  eliminarCorreo: (correo: string) => void;
  cambiarRol: (correo: string, nuevoRol: "admin" | "participante") => void;
  cambiarMonto: (correo: string, nuevoMonto: number) => void;
  nombres: { [correo: string]: string }; // 👈 aquí guardas "Nombre Apellido" devuelto por Supabase
}

const BloqueParticipantes: React.FC<Props> = ({
  correos,
  roles,
  montos,
  eliminarCorreo,
  cambiarRol,
  cambiarMonto,
  nombres,
}) => (
  <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
    <h3>👥 Integrantes del grupo</h3>

    {correos.length === 0 ? (
      <p>No has agregado participantes aún.</p>
    ) : (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Correo</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Nombre Apellido</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Rol</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Cuota mensual</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {correos.map((correo) => (
            <tr key={correo}>
              <td>{correo}</td>
              <td>{nombres[correo] || "—"}</td>
              <td>
                <select
                  value={roles[correo] || "participante"}
                  onChange={(e) => cambiarRol(correo, e.target.value as "admin" | "participante")}
                >
                  <option value="admin">Admin</option>
                  <option value="participante">Participante</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={montos[correo] || 0}
                  onChange={(e) => cambiarMonto(correo, Number(e.target.value))}
                  style={{ width: "80px" }}
                />
              </td>
              <td>
                <button onClick={() => eliminarCorreo(correo)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default BloqueParticipantes;
