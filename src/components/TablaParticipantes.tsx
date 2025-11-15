import React, { useEffect, useState } from "react";
import { verParticipantes } from "../utils/verParticipantesNuevo";
import { expulsarParticipante } from "../utils/expulsarParticipante";

interface Props {
  grupoId: string;
  adminId: string; // 👈 tipado seguro como UUID del administrador
}

interface Participante {
  usuario_id: string;
  rol: string;
  fecha_ingreso: string;
  estado: string;
  usuarios?: {
    nombre: string;
    apellido: string;
    correo: string;
  };
}

export default function TablaParticipantes({ grupoId, adminId }: Props) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarParticipantes = async () => {
    setError("");
    try {
      const resultado = await verParticipantes(grupoId, adminId);

      if (!resultado.error && Array.isArray(resultado.data)) {
        console.log("Participantes cargados:", resultado.data); // 🔍 verificación
        setParticipantes(resultado.data);
        setMensaje(resultado.mensaje || "✅ Participantes cargados correctamente");
      } else {
        setError(resultado.mensaje || "❌ Error al cargar participantes");
        setParticipantes([]);
      }
    } catch (err: any) {
      setError(err.message || "❌ Error inesperado al cargar participantes");
      setParticipantes([]);
    }
  };

  useEffect(() => {
    if (grupoId) {
      cargarParticipantes();
    }
  }, [grupoId]);

  const manejarExpulsion = async (usuarioId: string) => {
    setCargando(true);
    setMensaje("");
    setError("");
    try {
      const resultado = await expulsarParticipante(grupoId, usuarioId);
      setMensaje(resultado?.mensaje || "✅ Acción completada");
      await cargarParticipantes();
    } catch (err: any) {
      setError(err.message || "❌ Error al expulsar participante");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      {participantes.length === 0 ? (
        <p style={{ color: "#555" }}>
          No hay participantes registrados en este grupo.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Ingreso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {participantes.map((p) => (
              <tr key={p.usuario_id}>
                <td>
                  {p.usuarios?.nombre && p.usuarios?.apellido
                    ? `${p.usuarios.nombre} ${p.usuarios.apellido}`
                    : "—"}
                </td>
                <td>{p.usuarios?.correo || "Correo no disponible"}</td>
                <td>{p.rol}</td>
                <td>
                  {p.fecha_ingreso
                    ? new Date(p.fecha_ingreso).toLocaleDateString("es-CL")
                    : "Sin fecha"}
                </td>
                <td>{p.estado || "No definido"}</td>
                <td>
                  {p.rol !== "admin" && (
                    <button
                      onClick={() => manejarExpulsion(p.usuario_id)}
                      disabled={cargando}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "0.3rem 0.6rem",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Expulsar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
