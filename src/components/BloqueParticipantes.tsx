import React from "react";

interface Participante {
  correo: string;
  nombre: string;
  apellido: string;
  seleccionado: boolean;
}

interface Props {
  usuario: { correo: string; nombre: string; apellido: string };
  participantes: Participante[];
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
  participantes,
  cuotaMensual,
  nuevoCorreo,
  setNuevoCorreo,
  agregarCorreo,
  toggleSeleccionado,
  editarSeleccionados,
  eliminarSeleccionados,
  crearGrupo
}) => {
  const todos = [{ ...usuario, seleccionado: false }, ...participantes];

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
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>✔</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>#</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Correo</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Nombre</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Apellido</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Rol</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Cuota mensual</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((p, i) => (
            <tr key={p.correo} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem", textAlign: "center" }}>
                {p.correo === usuario.correo ? "—" : (
                  <input
                    type="checkbox"
                    checked={p.seleccionado}
                    onChange={() => toggleSeleccionado(p.correo)}
                  />
                )}
              </td>
              <td style={{ padding: "0.5rem" }}>{i + 1}</td>
              <td style={{ padding: "0.5rem" }}>{p.correo}</td>
              <td style={{ padding: "0.5rem" }}>{p.nombre}</td>
              <td style={{ padding: "0.5rem" }}>{p.apellido}</td>
              <td style={{ padding: "0.5rem" }}>{p.correo === usuario.correo ? "Administrador" : "Participante"}</td>
              <td style={{ padding: "0.5rem" }}>${cuotaMensual.toLocaleString("es-CL")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          onClick={editarSeleccionados}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f39c12",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          📝 Editar seleccionados
        </button>
        <button
          onClick={eliminarSeleccionados}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          🗑️ Eliminar seleccionados
        </button>
      </div>

      <button
        onClick={crearGrupo}
        disabled={participantes.length === 0}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: participantes.length === 0 ? "#bdc3c7" : "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: participantes.length === 0 ? "not-allowed" : "pointer"
        }}
      >
        ✅ Registrar grupo
      </button>
    </div>
  );
};

export default BloqueParticipantes;
