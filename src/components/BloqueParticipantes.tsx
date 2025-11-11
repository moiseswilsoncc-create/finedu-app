import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Props {
  usuario: { correo: string };
  correos: string[];
  montos: { [correo: string]: number };
  nombres: { [correo: string]: string };
  nuevoCorreo: string;
  setNuevoCorreo: (v: string) => void;
  agregarCorreo: () => void;
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
  aporteMensual,
  setNombres,
  setMontos,
}) => {
  const navigate = useNavigate();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  // Inicializar admin con nombre/apellido desde tabla usuarios
  useEffect(() => {
    const fetchNombreAdmin = async () => {
      if (usuario?.correo) {
        const { data } = await supabase
          .from("usuarios")
          .select("nombre, apellido")
          .eq("correo", usuario.correo.toLowerCase())
          .single();

        const nombreCompleto = data ? `${data.nombre} ${data.apellido}` : "Administrador";

        setNombres((prev) => ({
          ...prev,
          [usuario.correo]: nombreCompleto,
        }));

        setMontos((prev) => ({
          ...prev,
          [usuario.correo]: prev[usuario.correo] || aporteMensual,
        }));
      }
    };

    fetchNombreAdmin();
  }, [usuario?.correo, aporteMensual, setNombres, setMontos]);

  const toggleSeleccion = (correo: string) => {
    setSeleccionados((prev) =>
      prev.includes(correo)
        ? prev.filter((c) => c !== correo)
        : [...prev, correo]
    );
  };

  const editarSeleccionado = () => {
    alert("✏️ Función de edición pendiente.");
  };

  const eliminarSeleccionados = () => {
    const nuevosCorreos = correos.filter((c) => !seleccionados.includes(c));
    setMontos((prev) => {
      const copia = { ...prev };
      seleccionados.forEach((c) => delete copia[c]);
      return copia;
    });
    setNombres((prev) => {
      const copia = { ...prev };
      seleccionados.forEach((c) => delete copia[c]);
      return copia;
    });
    setSeleccionados([]);
  };

  const fetchNombreParticipante = async (correo: string) => {
    const { data } = await supabase
      .from("usuarios")
      .select("nombre, apellido")
      .eq("correo", correo.toLowerCase())
      .single();

    return data ? `${data.nombre} ${data.apellido}` : null;
  };

  const handleAgregarCorreo = async () => {
    const correoLimpio = nuevoCorreo.trim().toLowerCase();
    if (
      correoLimpio &&
      !correos.includes(correoLimpio) &&
      correoLimpio !== usuario.correo
    ) {
      const nombreCompleto = await fetchNombreParticipante(correoLimpio);

      if (!nombreCompleto) {
        alert("⚠️ El correo ingresado no está registrado en Finedu. El participante debe estar registrado para poder unirse al grupo.");
        return;
      }

      setNombres((prev) => ({ ...prev, [correoLimpio]: nombreCompleto }));
      setMontos((prev) => ({ ...prev, [correoLimpio]: aporteMensual }));
      agregarCorreo();
    }
  };

  return (
    <>
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
            <button onClick={handleAgregarCorreo}>➕ Agregar</button>
          </div>
        </div>

        {/* Tabla de participantes */}
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
            {/* Admin */}
            <tr>
              <td>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(usuario.correo)}
                  onChange={() => toggleSeleccion(usuario.correo)}
                />
              </td>
              <td>{usuario.correo}</td>
              <td>{nombres[usuario.correo] || "Administrador"}</td>
              <td>{montos[usuario.correo] || 0}</td>
            </tr>

            {/* Participantes */}
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
                <td>{nombres[correo] || "—"}</td>
                <td>
                  <input
                    type="number"
                    value={montos[correo] || 0}
                    onChange={(e) =>
                      setMontos((prev) => ({
                        ...prev,
                        [correo]: Number(e.target.value),
                      }))
                    }
                    style={{ width: "100px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botones institucionales */}
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={editarSeleccionado}>✏️ Editar seleccionado</button>
          <button onClick={eliminarSeleccionados}>🗑️ Eliminar seleccionados</button>
          <button onClick={crearGrupo}>✅ Crear grupo</button>
        </div>
      </div>

      {/* Botón externo de navegación */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button onClick={() => navigate("/panel-usuario")}>🏠 Volver al menú principal</button>
      </div>
    </>
  );
};

export default BloqueParticipantes;
