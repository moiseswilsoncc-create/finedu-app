import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { api } from "../axiosConfig";

const PublicarOfertaColaborador: React.FC = () => {
  const [titulo, setTitulo] = useState("");
  const [rol, setRol] = useState("crédito");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const correo = localStorage.getItem("correoColaborador");

  useEffect(() => {
    if (correo) {
      api.post("/guardar-visualizacion", {
        usuario_id: correo,
        modulo: "PublicarOfertaColaborador"
      });
    }
  }, [correo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!correo) {
      setMensaje("❌ No se encontró el correo del colaborador.");
      return;
    }

    const hoy = new Date();
    const fechaExp = new Date(fechaExpiracion);

    const nuevaOferta = {
      correo,                          // 👈 columna correo
      institucion: titulo,             // 👈 usamos título como institución
      rol,                             // 👈 tipo de oferta
      fecha_invitacion: hoy.toISOString(), // 👈 fecha actual
      expira: fechaExp.toISOString()   // 👈 fecha de expiración
    };

    const { error } = await supabase
      .from("ofertas_colaboradores")   // 👈 nombre correcto de la tabla
      .insert([nuevaOferta]);

    if (error) {
      console.error("❌ Error al guardar oferta:", error.message);
      setMensaje("❌ Error al guardar la oferta.");
    } else {
      setMensaje("✅ Oferta publicada correctamente.");
      setTitulo("");
      setRol("crédito");
      setFechaExpiracion("");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>📢 Publicar oferta institucional</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nombre de la institución / título"
          required
          style={inputStyle}
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="crédito">Crédito</option>
          <option value="inversión">Inversión</option>
          <option value="educación">Educación</option>
        </select>
        <input
          type="date"
          value={fechaExpiracion}
          onChange={(e) => setFechaExpiracion(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          ✅ Publicar oferta
        </button>
      </form>
      {mensaje && (
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            color: mensaje.includes("✅") ? "green" : "red"
          }}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: "600px",
  margin: "2rem auto",
  padding: "2rem",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const titleStyle = {
  color: "#2c3e50",
  marginBottom: "1rem"
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "0.8rem",
  backgroundColor: "#27ae60",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer"
};

export default PublicarOfertaColaborador;
