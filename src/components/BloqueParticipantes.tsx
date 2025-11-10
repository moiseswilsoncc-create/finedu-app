import React from "react";

interface Participante {
  correo: string;
  nombre: string;
  apellido: string;
  seleccionado: boolean;
}

interface Props {
  usuario: { correo: string; nombre: string; apellido: string };
  participantes?: Participante[]; // opcional para evitar crash
  cuotaMensual: number;
  nuevoCorreo: string;
  setNuevoCorreo: (v: string) => void;
  agregarCorreo: () => void;
  toggleSeleccionado: (correo: string) => void;
  editarSeleccionados: () => void;
  eliminarSeleccionados: () => void;
  crearGrupo: () => void;
}

const BloqueParticipantes: React.FC<Props> = ({
  usuario,
  participantes = [], // fallback seguro
  cuotaMensual,
  nuevoCorreo,
  setNuevoCorreo,
  agregarCorreo,
  toggleSeleccionado,
  editarSeleccionados,
  eliminarSeleccionados,
  crearGrupo
}) => {
  const todos = [{ ...usuario, seleccionado: false }, ...(Array.isArray(participantes) ? participantes : [])];
  const hayParticipantes = Array.isArray(participantes) && participantes.length > 0;

  return (
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
            <th>✔</th><th>#</th><th>Correo</th><th>Nombre</th><th>Apellido</th><th>Rol</th><th>Cuota mensual</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((p, i) => (
            <tr key={p.correo} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ textAlign: "center" }}>
                {p.correo === usuario.correo ? "—" : (
                  <input
                    type="checkbox"
                    checked={p.seleccionado}
                    onChange={() => toggleSeleccionado(p.correo)}
                  />
                )}
              </td>
              <td>{i + 1}</td>
              <td>{p.correo}</td>
              <td>{p.nombre || "—"}</td>
              <td>{p.apellido || "—"}</td>
              <td>{p.correo === usuario.correo ? "Administrador" : "Participante"}</td>
              <td>
                {typeof cuotaMensual === "number" ? `$${cuotaMensual.toLocaleString("es-CL")}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button onClick={editarSeleccionados} style={{ backgroundColor: "#f39c12", color: "white" }}>📝 Editar seleccionados</button>
        <button onClick={eliminarSeleccionados} style={{ backgroundColor: "#e74c3c", color: "white" }}>🗑️ Eliminar seleccionados</button>
      </div>

      <button
        onClick={crearGrupo}
        disabled={!hayParticipantes}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: !hayParticipantes ? "#bdc3c7" : "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: !hayParticipantes ? "not-allowed" : "pointer"
        }}
      >
        ✅ Registrar grupo
      </button>
    </div>
  );
};

export default BloqueParticipantes;
