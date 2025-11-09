import React from "react";

interface Props {
  usuario: { correo: string };
  correos: string[];
  roles: { [correo: string]: "admin" | "participante" };
  cuotaMensual: number;
  nuevoCorreo: string;
  agregarCorreo: () => void;
  eliminarCorreo: (correo: string) => void;
  cambiarRol: (correo: string, nuevoRol: "admin" | "participante") => void;
  setNuevoCorreo: (v: string) => void;
  crearGrupo: () => void;
}

const BloqueParticipantes: React.FC<Props> = ({
  usuario,
  correos,
  roles,
  cuotaMensual,
  nuevoCorreo,
  agregarCorreo,
  eliminarCorreo,
  cambiarRol,
  setNuevoCorreo,
  crearGrupo
}) => (
  <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
    <h3>👥 Participantes del grupo</h3>

    <label>Agregar integrante (correo):</label>
    <input
      type="email"
      value={nuevoCorreo}
      onChange={(e) => setNuevoCorreo(e.target.value)}
      placeholder="correo@ejemplo.com"
      style={{ marginRight: "0.5rem" }}
    />
    <button onClick={agregarCorreo}>➕ Agregar</button>

    <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>#</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Monto mensual</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {[usuario.correo, ...correos].map((correo, i) => (
          <tr key={correo}>
            <td>{i + 1}</td>
            <td>{correo}</td>
            <td>
              {correo === usuario.correo ? (
                "Administrador"
              ) : (
                <select
                  value={roles[correo]}
                  onChange={(e) =>
                    cambiarRol(correo, e.target.value as "admin" | "participante")
                  }
                >
                  <option value="participante">Participante</option>
                  <option value="admin">Administrador</option>
                </select>
              )}
            </td>
            <td>${cuotaMensual.toLocaleString("es-CL")}</td>
            <td>
              {correo === usuario.correo ? "—" : (
                <button onClick={() => eliminarCorreo(correo)}>❌</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <button
      onClick={crearGrupo}
      style={{
        marginTop: "2rem",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#27ae60",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      ✅ Registrar grupo
    </button>
  </div>
);

export default BloqueParticipantes;
