// src/components/InvitacionColaboradores.tsx
import React, { useState } from "react";
import axios from "../axiosConfig";

const InvitacionColaboradores: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [rol, setRol] = useState("");
  const [expira, setExpira] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!correo || !institucion || !rol || !expira) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validarEmail(correo)) {
      setError("Correo inválido.");
      return;
    }

    try {
      const res = await axios.post("/api/invitar-colaborador", {
        correo,
        institucion,
        rol,
        expira, // formato YYYY-MM-DD
      });

      if (res.data?.ok) {
        setMensaje("✅ Invitación creada correctamente.");
        setCorreo("");
        setInstitucion("");
        setRol("");
        setExpira("");
      } else {
        setError(res.data?.error || "❌ No se pudo crear la invitación.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h3 style={{ marginBottom: "1rem" }}>📨 Invitar nuevo colaborador</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Correo del colaborador"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Institución"
          value={institucion}
          onChange={(e) => setInstitucion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Rol (ej: Analista, Admin, Colaborador)"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
        />
        <input
          type="date"
          value={expira}
          onChange={(e) => setExpira(e.target.value)}
          required
        />

        {mensaje && <p style={{ color: "#2ecc71" }}>{mensaje}</p>}
        {error && <p style={{ color: "#e74c3c" }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Crear invitación
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#7f8c8d" }}>
        Al crear la invitación, el correo podrá registrarse si la política RLS lo permite.
      </p>
    </div>
  );
};

export default InvitacionColaboradores;
