import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPerfil } from "../context/UserContext"; // 👈 integración con UserContext

interface Props {
  usuario: { correo: string };
  correos: string[];
  montos: { [correo: string]: number };
  nombres: { [correo: string]: string }; // 👈 aquí se recibe nombre completo desde el padre
  nuevoCorreo: string;
  setNuevoCorreo: (v: string) => void;
  agregarCorreo: (correo: string) => Promise<void>; // 👈 delega validación al padre
  crearGrupo: () => void;
  aporteMensual: number;
  setNombres: React.Dispatch<React.SetStateAction<{ [correo: string]: string }>>;
  setMontos: React.Dispatch<React.SetStateAction<{ [correo: string]: number }>>;
}

const BloqueParticipantes: React.FC<Props> = ({
  usuario,
  correos,
  montos,
  nombres,
  nuevoCorreo,
  setNuevoCorreo,
  agregarCorreo,
  crearGrupo,
}) => {
  const navigate = useNavigate();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const perfil = useUserPerfil(); // 👈 obtenemos nombre+apellido del administrador

  const toggleSeleccion = (correo: string) => {
    setSeleccionados((prev) =>
      prev.includes(correo) ? prev.filter((c) => c !== correo) : [...prev, correo]
    );
  };

  const editarSeleccionado = () => {
    alert("✏️ Función de edición pendiente.");
  };

  const eliminarSeleccionados = () => {
    setSeleccionados([]);
    alert("🗑️ Eliminación pendiente de implementación en el padre.");
  };

  const handleAgregarCorreo = () => {
    const correoLimpio = nuevoCorreo.trim().toLowerCase();

    if (
      correoLimpio &&
      !correos.includes(correoLimpio) &&
      correoLimpio !== usuario.correo
    ) {
      agregarCorreo(correoLimpio); // 👈 validación y recuperación de nombre/apellido en el padre
    }
  };

  return (
    <>
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>👥 Integrantes del grupo</h3>

        <div style={{ marginBottom: "1rem" }}>
          <label>Agregar participante por correo:</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              style={{ flex: 1 }}
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
            <button onClick={handleAgregarCorreo}>➕ Agregar</button>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>☑</th>
              <th>Correo</th>
              <th>Nombre Apellido</th>
              <th>Total cuota mensual</th>
            </tr>
          </thead>
          <tbody>
            {/* Administrador */}
            <tr>
              <td>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(usuario.correo)}
                  onChange={() => toggleSeleccion(usuario.correo)}
                />
              </td>
              <td>{usuario.correo}</td>
              <td>
                {perfil
                  ? `${perfil.nombre} ${perfil.apellido}`
                  : nombres[usuario.correo] || "Administrador"}
              </td>
              <td>{montos[usuario.correo] || 0}</td>
            </tr>

            {/* Participantes agregados */}
            {correos.map((correo) => (
              <tr key={correo}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(correo)}
                    onChange={() => toggleSeleccion(correo)}
                  />
                </td>
                <td>{correo}</td>
                <td>{nombres[correo] || "—"}</td> {/* 👈 muestra nombre+apellido recuperado */}
                <td>
                  <input
                    type="number"
                    value={montos[correo] || 0}
                    onChange={() =>
                      alert("✏️ Cambio de monto pendiente de implementación en el padre.")
                    }
                    style={{ width: "100px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button onClick={editarSeleccionado}>✏️ Editar seleccionado</button>
          <button onClick={eliminarSeleccionados}>🗑️ Eliminar seleccionados</button>
          <button onClick={crearGrupo}>✅ Crear grupo</button>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button onClick={() => navigate("/panel-usuario")}>
          🏠 Volver al menú principal
        </button>
      </div>
    </>
  );
};

export default BloqueParticipantes;
