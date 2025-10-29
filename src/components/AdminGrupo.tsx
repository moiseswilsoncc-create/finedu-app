import React, { useState } from "react";
import { useGrupo } from "../context/GrupoContext";

const AdminGrupo: React.FC = () => {
  const {
    nombreGrupoMeta,
    metaGrupal,
    participantes,
    setGrupo,
    actualizarParticipante,
  } = useGrupo();

  const [nuevoNombre, setNuevoNombre] = useState(nombreGrupoMeta);
  const [nuevaMeta, setNuevaMeta] = useState(metaGrupal);
  const [nuevoParticipante, setNuevoParticipante] = useState({
    nombre: "",
    ingresos: 0,
    egresos: 0,
  });

  const guardarGrupo = () => {
    if (!nuevoNombre.trim() || nuevaMeta <= 0) {
      alert("Completa el nombre y la meta correctamente.");
      return;
    }
    setGrupo(nuevoNombre, nuevaMeta);
    alert("✅ Grupo actualizado.");
  };

  const agregarParticipante = () => {
    const { nombre, ingresos, egresos } = nuevoParticipante;
    if (!nombre.trim() || ingresos < 0 || egresos < 0) {
      alert("Completa los datos del participante correctamente.");
      return;
    }
    actualizarParticipante(nombre, ingresos, egresos);
    setNuevoParticipante({ nombre: "", ingresos: 0, egresos: 0 });
    alert("✅ Participante agregado o actualizado.");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🛠️ Panel de Administración del Grupo</h2>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        Nombre del grupo:
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        Meta grupal:
        <input
          type="number"
          value={nuevaMeta}
          onChange={(e) => setNuevaMeta(Number(e.target.value))}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </label>

      <button
        onClick={guardarGrupo}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      >
        Guardar grupo
      </button>

      <h3>👥 Agregar o actualizar participante</h3>

      <input
        type="text"
        placeholder="Nombre"
        value={nuevoParticipante.nombre}
        onChange={(e) =>
          setNuevoParticipante({ ...nuevoParticipante, nombre: e.target.value })
        }
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />

      <input
        type="number"
        placeholder="Ingresos"
        value={nuevoParticipante.ingresos}
        onChange={(e) =>
          setNuevoParticipante({
            ...nuevoParticipante,
            ingresos: Number(e.target.value),
          })
        }
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />

      <input
        type="number"
        placeholder="Egresos"
        value={nuevoParticipante.egresos}
        onChange={(e) =>
          setNuevoParticipante({
            ...nuevoParticipante,
            egresos: Number(e.target.value),
          })
        }
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />

      <button
        onClick={agregarParticipante}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#2196f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Agregar participante
      </button>

      <h4 style={{ marginTop: "2rem" }}>📋 Participantes actuales</h4>
      <ul>
        {participantes.map((p, i) => (
          <li key={i}>
            {p.nombre}: ${p.ingresos - p.egresos}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminGrupo;
