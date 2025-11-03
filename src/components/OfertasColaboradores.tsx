// src/components/OfertasColaboradores.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axiosConfig"; // ✅ usamos el cliente configurado
import { supabase } from "../supabaseClient";

const OfertasColaboradores: React.FC = () => {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState("");
  const [tiposDisponibles, setTiposDisponibles] = useState<string[]>([
    "crédito", "curso", "beneficio", "tasa"
  ]);
  const [nuevoTipo, setNuevoTipo] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pais, setPais] = useState("Chile");
  const [ciudad, setCiudad] = useState("Santiago");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleAgregarTipo = () => {
    if (nuevoTipo && !tiposDisponibles.includes(nuevoTipo)) {
      setTiposDisponibles([...tiposDisponibles, nuevoTipo]);
      setTipo(nuevoTipo);
      setNuevoTipo("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!tipo || !titulo || !descripcion || !fechaExpiracion || !pais || !ciudad) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const colaborador =
      localStorage.getItem("correoColaborador") || "desconocido@finedu.cl";

    if (!/\S+@\S+\.\S+/.test(colaborador)) {
      setError("Correo del colaborador no válido.");
      return;
    }

    try {
      const response = await api.post("/guardar-oferta", { // ✅ usamos api
        colaborador,
        tipo,
        titulo,
        descripcion,
        ciudad,
        pais,
        fecha_expiracion: fechaExpiracion
      });

      if (response.data.mensaje) {
        setMensaje("✅ Oferta publicada correctamente.");
        setError("");
        // Limpiar formulario
        setTipo("");
        setTitulo("");
        setDescripcion("");
        setPais("Chile");
        setCiudad("Santiago");
        setFechaExpiracion("");
        setTimeout(() => navigate("/panel-colaboradores"), 2000);
      } else {
        setError("❌ No se pudo guardar la oferta.");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        📢 Publicar datos y ofertas institucionales
      </h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value="">Selecciona tipo de publicación</option>
          {tiposDisponibles.map((t, index) => (
            <option key={index} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Agregar nuevo tipo"
            value={nuevoTipo}
            onChange={(e) => setNuevoTipo(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={handleAgregarTipo}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#16a085",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            ➕ Tipo
          </button>
        </div>

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
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
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

        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Publicar oferta
        </button>
      </form>
    </div>
  );
};

export default OfertasColaboradores;
