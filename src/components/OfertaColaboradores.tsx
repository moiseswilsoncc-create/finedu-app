import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const OfertaColaboradores: React.FC = () => {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pais, setPais] = useState("Chile");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipo || !titulo || !descripcion || !fechaExpiracion || !pais) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const colaborador = localStorage.getItem("correoColaborador") || "desconocido@finedu.cl";

      const response = await axios.post("/guardar-oferta", {
        colaborador,
        tipo,
        titulo,
        descripcion,
        pais,
        fechaExpiracion,
      });

      if (response.data.success) {
        setMensaje("✅ Oferta publicada correctamente.");
        setError("");
        setTimeout(() => navigate("/panel-colaborador"), 2000);
      } else {
        setError("❌ No se pudo guardar la oferta.");
        setMensaje("");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Error de conexión con el servidor.");
      setMensaje("");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>📢 Publicar datos y ofertas</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value="">Selecciona tipo de publicación</option>
          <option value="crédito">🏦 Crédito</option>
          <option value="curso">🎓 Curso</option>
          <option value="beneficio">🎁 Beneficio</option>
          <option value="tasa">📉 Tasa preferencial</option>
        </select>

        <input
          type="text"
          placeholder="Título de la oferta"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <textarea
          placeholder="Descripción detallada"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={5}
          required
        />

        <input
          type="text"
          placeholder="País (ej: Chile, Perú, México)"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          required
        />

        <input
          type="date"
          value={fechaExpiracion}
          onChange={(e) => setFechaExpiracion(e.target.value)}
          required
        />

        {mensaje && <p style={{ color: "#2ecc71" }}>{mensaje}</p>}
        {error && <p style={{ color: "#e74c3c" }}>{error}</p>}

        <button type="submit" style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          Publicar oferta
        </button>
      </form>
    </div>
  );
};

export default OfertaColaboradores;
