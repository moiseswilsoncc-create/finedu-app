import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "../axiosConfig";
import { OfertaColaborador } from "../types";

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

const PublicarOfertaColaborador: React.FC = () => {
  const [oferta, setOferta] = useState<OfertaColaborador>({
    titulo: "",
    descripcion: "",
    tipo: "crédito",
    tasaInteres: 0,
    plazoMeses: 0,
    montoMinimo: 0,
    ciudad: "Santiago",
    pais: "Chile"
  });

  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const correo = localStorage.getItem("correoColaborador");

  useEffect(() => {
    if (correo) {
      axios.post("/guardar-visualizacion", {
        usuario_id: correo,
        modulo: "PublicarOfertaColaborador"
      });
    }
  }, [correo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOferta(prev => ({
      ...prev,
      [name]: ["tasaInteres", "plazoMeses", "montoMinimo"].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!correo) {
      setMensaje("❌ No se encontró el correo del colaborador.");
      return;
    }

    const hoy = new Date();
    const fechaExp = new Date(fechaExpiracion);
    const visibilidad = fechaExp > hoy;

    const nuevaOferta = {
      ...oferta,
      fecha_expiracion: fechaExp.toISOString().split("T")[0],
      colaborador: correo,
      fecha_publicacion: hoy.toISOString(),
      visibilidad
    };

    const response = await supabase.from("ofertas_colaborador").insert([nuevaOferta]);

    if (response.error) {
      console.error("❌ Error al guardar oferta:", response.error.message);
      setMensaje("❌ Error al guardar la oferta.");
    } else {
      setMensaje("✅ Oferta publicada correctamente.");
      setOferta({
        titulo: "",
        descripcion: "",
        tipo: "crédito",
        tasaInteres: 0,
        plazoMeses: 0,
        montoMinimo: 0,
        ciudad: "Santiago",
        pais: "Chile"
      });
      setFechaExpiracion("");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>📢 Publicar datos y ofertas institucionales</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <input type="text" name="titulo" value={oferta.titulo} onChange={handleChange} placeholder="Título de la oferta" required style={inputStyle} />
        <textarea name="descripcion" value={oferta.descripcion} onChange={handleChange} placeholder="Descripción detallada" required style={{ ...inputStyle, height: "100px" }} />
        <select name="tipo" value={oferta.tipo} onChange={handleChange} required style={inputStyle}>
          <option value="crédito">Crédito</option>
          <option value="inversión">Inversión</option>
          <option value="educación">Educación</option>
        </select>
        <input type="number" name="tasaInteres" value={oferta.tasaInteres} onChange={handleChange} placeholder="Tasa de interés (%)" required style={inputStyle} />
        <input type="number" name="plazoMeses" value={oferta.plazoMeses} onChange={handleChange} placeholder="Plazo en meses" required style={inputStyle} />
        <input type="number" name="montoMinimo" value={oferta.montoMinimo} onChange={handleChange} placeholder="Monto mínimo ($)" required style={inputStyle} />
        <input type="text" name="ciudad" value={oferta.ciudad} onChange={handleChange} placeholder="Ciudad" required style={inputStyle} />
        <input type="text" name="pais" value={oferta.pais} onChange={handleChange} placeholder="País" required style={inputStyle} />
        <input type="date" value={fechaExpiracion} onChange={(e) => setFechaExpiracion(e.target.value)} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>✅ Publicar oferta</button>
      </form>
      {mensaje && (
        <p style={{
          marginTop: "1rem",
          textAlign: "center",
          color: mensaje.includes("✅") ? "green" : "red"
        }}>
          {mensaje}
        </p>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: "700px",
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
