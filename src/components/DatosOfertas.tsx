import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { OfertaColaborador } from "../types";

const supabaseUrl = "https://ftsbnorudtcyrrubutt.supabase.co";
const supabaseKey = "TU_API_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const DatosOfertas: React.FC = () => {
  const [oferta, setOferta] = useState<OfertaColaborador>({
    titulo: "",
    descripcion: "",
    tipo: "crédito",
    tasaInteres: 0,
    plazoMeses: 0,
    montoMinimo: 0,
    pais: "Chile"
  });

  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const correo = localStorage.getItem("correo");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOferta(prev => ({
      ...prev,
      [name]: name === "tasaInteres" || name === "plazoMeses" || name === "montoMinimo" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!correo) {
      setMensaje("No se encontró el correo del colaborador.");
      return;
    }

    const response = await supabase.from("ofertas_colaborador").insert([
      {
        ...oferta,
        fecha_expiracion: fechaExpiracion,
        colaborador: correo,
        fecha_publicacion: new Date().toISOString(),
        visibilidad: true
      }
    ]);

    if (response.error) {
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
        pais: "Chile"
      });
      setFechaExpiracion("");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "2rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>📢 Publicar datos y ofertas</h2>
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
        <input type="text" name="pais" value={oferta.pais} onChange={handleChange} placeholder="País" required style={inputStyle} />
        <input type="date" value={fechaExpiracion} onChange={(e) => setFechaExpiracion(e.target.value)} required style={inputStyle} />
        <button type="submit" style={{ padding: "0.8rem", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", cursor: "pointer" }}>
          ✅ Publicar oferta
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "1rem", textAlign: "center", color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</p>}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

export default DatosOfertas;
