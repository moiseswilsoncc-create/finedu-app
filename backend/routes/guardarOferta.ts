import React, { useState } from "react";
import axios from "axios";

const DatosOfertas: React.FC = () => {
  const [formulario, setFormulario] = useState({
    tipo: "",
    titulo: "",
    descripcion: "",
    ciudad: "",
    pais: "",
    fecha_expiracion: "",
    colaborador: ""
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await axios.post("http://localhost:4000/api/guardar-oferta", formulario);
      setMensaje(response.data.mensaje || "✅ Oferta registrada correctamente.");
      setFormulario({
        tipo: "",
        titulo: "",
        descripcion: "",
        ciudad: "",
        pais: "",
        fecha_expiracion: "",
        colaborador: ""
      });
    } catch (error: any) {
      setMensaje("❌ Error al registrar la oferta.");
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <h2>📢 Ingreso de Oferta Institucional</h2>
      <form onSubmit={handleSubmit}>
        <select name="tipo" value={formulario.tipo} onChange={handleChange} required>
          <option value="">Selecciona tipo</option>
          <option value="Crédito">Crédito</option>
          <option value="Curso">Curso</option>
          <option value="Beneficio">Beneficio</option>
        </select>

        <input type="text" name="titulo" placeholder="Título" value={formulario.titulo} onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={handleChange} required />
        <input type="text" name="ciudad" placeholder="Ciudad" value={formulario.ciudad} onChange={handleChange} required />
        <input type="text" name="pais" placeholder="País" value={formulario.pais} onChange={handleChange} required />
        <input type="date" name="fecha_expiracion" value={formulario.fecha_expiracion} onChange={handleChange} required />
        <input type="email" name="colaborador" placeholder="Correo del colaborador" value={formulario.colaborador} onChange={handleChange} required />

        <button type="submit">Guardar Oferta</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default DatosOfertas;
