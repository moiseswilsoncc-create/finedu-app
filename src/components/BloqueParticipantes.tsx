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
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      <input
        type="email"
        value={nuevoCorreo}
        onChange={(e) => setNuevoCorreo(e.target.value)}
        placeholder="correo@ejemplo.com"
        style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <button
        onClick={agregarCorreo}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        ➕ Agregar
      </button>
    </div>

    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
      <thead>
        <tr style={{ backgroundColor: "#f2f2f2" }}>
          <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>#</th>
          <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Correo</th>
          <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Rol</th>
          <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Monto mensual</th>
          <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {[usuario.correo, ...correos].map((correo, i) => (
          <tr key={correo} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}>{i + 1}</td>
            <td style={{ padding: "0.5rem" }}>{correo}</td>
            <td style={{ padding: "0.5rem" }}>
              {correo === usuario.correo ? (
                "Administrador"
              ) : (
                <select
                  value={roles[correo]}
                  onChange={(e) =>
                    cambiarRol(correo, e.target.value as "admin" | "participante")
                  }
                  style={{ padding: "0.25rem", borderRadius: "4px" }}
                >
                  <option value="participante">Participante</option>
                  <option value="admin">Administrador</option>
                </select>
              )}
            </td>
            <td style={{ padding: "0.5rem" }}>${cuotaMensual.toLocaleString("es-CL")}</td>
            <td style={{ padding: "0.5rem" }}>
              {correo === usuario.correo ? "—" : (
                <button
                  onClick={() => eliminarCorreo(correo)}
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer"
                  }}
                >
                  ❌
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <button
      onClick={crearGrupo}
      disabled={correos.length === 0}
      style={{
        marginTop: "2rem",
        padding: "0.75rem 1.5rem",
        backgroundColor: correos.length === 0 ? "#bdc3c7" : "#27ae60",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: correos.length === 0 ? "not-allowed" : "pointer"
      }}
    >
      ✅ Registrar grupo
    </button>
  </div>
);

export default BloqueParticipantes;
