import React, { useState } from "react";
import axios from "axios";

const FormularioOferta: React.FC = () => {
  const [formulario, setFormulario] = useState({
    tipo: "",
    titulo: "",
    descripcion: "",
    pais: "",
    fecha_expiracion: "",
    correo: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("⏳ Enviando oferta...");

    try {
      const response = await axios.post(
       `${import.meta.env.VITE_API_URL}/guardar-oferta` 
        formulario
      );
      setMensaje("✅ Oferta registrada correctamente");
      console.log("📨 Respuesta:", response.data);
    } catch (error) {
      console.error("❌ Error al enviar:", error);
      setMensaje("❌ Error al registrar la oferta");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>📋 Publicar Oferta</h2>

      <input name="tipo" placeholder="Tipo de oferta" onChange={handleChange} required />
      <input name="titulo" placeholder="Título" onChange={handleChange} required />
      <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} required />
      <input name="pais" placeholder="País" onChange={handleChange} required />
      <input type="date" name="fecha_expiracion" onChange={handleChange} required />
      <input type="email" name="correo" placeholder="Correo de contacto" onChange={handleChange} required />

      <button type="submit">Enviar oferta</button>
      <p>{mensaje}</p>
    </form>
  );
};

export default FormularioOferta;
