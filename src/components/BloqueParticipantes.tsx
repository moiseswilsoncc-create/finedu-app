import React from "react";

interface Props {
  usuario: { correo: string };
  correos: string[];
  montos: { [correo: string]: number };
  nombres: { [correo: string]: string }; // Nombre Apellido devuelto por Supabase
  nuevoCorreo: string;
  setNuevoCorreo: (v: string) => void;
  agregarCorreo: () => void;
  eliminarCorreo: (correo: string) => void;
  cambiarMonto: (correo: string, nuevoMonto: number) => void;
  crearGrupo: () => void;
}

const BloqueParticipantes: React.FC<Props> = ({
  usuario,
  correos,
  montos,
  nombres,
  nuevoCorreo,
  setNuevoCorreo,
  agregarCorreo,
  eliminarCorreo,
  cambiarMonto,
  crearGrupo,
}) => (
  <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
    <h3>👥 Integrantes del grupo</h3>

    {/* Input para agregar nuevo correo */}
    <div style={{ marginBottom: "1rem" }}>
      <label>Agregar participante por correo:</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          style={{ flex: 1 }}
          value={nuevoCorreo}
          onChange={(e) => setNuevoCorreo(e.target.value)}
          placeholder="correo@ejemplo.com"
        />
        <button onClick={agregarCorreo}>➕ Agregar</button>
      </div>
    </div>

    {/* Tabla de participantes */}
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Correo</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Nombre Apellido</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Total cuota mensual</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {/* Admin siempre visible */}
        <tr>
          <td>{usuario.correo}</td>
          <td>{nombres[usuario.correo] || "—"}</td>
          <td>{montos[usuario.correo] || 0}</td>
          <td></td>
        </tr>

        {/* Participantes agregados */}
        {correos.map((correo) => (
          <tr key={correo}>
            <td>{correo}</td>
            <td>{nombres[correo] || "—"}</td>
            <td>
              <input
                type="number"
                value={montos[correo] || 0}
                onChange={(e) => cambiarMonto(correo, Number(e.target.value))}
                style={{ width: "100px" }}
              />
            </td>
            <td>
              <button onClick={() => eliminarCorreo(correo)}>❌</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Botón final para crear grupo */}
    <div style={{ marginTop: "1rem" }}>
      <button onClick={crearGrupo}>✅ Crear grupo</button>
    </div>
  </div>
);

export default BloqueParticipantes;
