import React, { useState } from "react";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

type Props = {
  onAgregar: (nuevo: Participante) => void;
};

const VistaParticipante: React.FC<Props> = ({ onAgregar }) => {
  const [nombre, setNombre] = useState("");
  const [ingresos, setIngresos] = useState<number | "">("");
  const [egresos, setEgresos] = useState<number | "">("");
  const [error, setError] = useState("");

  const handleAgregar = () => {
    if (!nombre || ingresos === "" || egresos === "") {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    if (ingresos < 0 || egresos < 0) {
      setError("⚠️ Los valores no pueden ser negativos.");
      return;
    }

    onAgregar({ nombre, ingresos, egresos });
    setNombre("");
    setIngresos("");
    setEgresos("");
    setError("");
  };

  return (
    <div style={{
      padding: "1.5rem",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      maxWidth: "500px",
      margin: "2rem auto"
    }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>👥 Agregar participante</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Ingresos"
          value={ingresos}
          onChange={(e) => setIngresos(Number(e.target.value))}
          style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Egresos"
          value={egresos}
          onChange={(e) => setEgresos(Number(e.target.value))}
          style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        {error && <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>{error}</p>}

        <button
          onClick={handleAgregar}
          style={{
            padding: "0.8rem",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ➕ Agregar
        </button>
      </div>
    </div>
  );
};

export default VistaParticipante;
