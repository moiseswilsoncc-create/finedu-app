import React, { useState } from "react";
import axios from "../axiosConfig";

function RegistroColaborador() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    rol: "",
    area: "",
    institucion: "",
    pais: "Chile",
    ciudad: "",
    contrasena: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/solicitud-colaborador", formulario);

      if (response.data.success) {
        setMensaje("✅ Solicitud enviada correctamente. La institución revisará tu acceso.");
        setFormulario({
          nombre: "",
          apellido: "",
          rol: "",
          area: "",
          institucion: "",
          pais: "Chile",
          ciudad: "",
          contrasena: "",
        });
      } else {
        setMensaje("❌ No se pudo enviar la solicitud.");
      }
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Registro de nuevo colaborador</h2>
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        Este formulario es solo para solicitud de acceso. La institución debe autorizar tu ingreso por correo.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
          margin: "auto",
          textAlign: "left"
        }}
      >
        <input type="text" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} required />
        <input type="text" name="apellido" placeholder="Apellido" value={formulario.apellido} onChange={handleChange} required />
        <input type="text" name="rol" placeholder="Rol o cargo" value={formulario.rol} onChange={handleChange} required />
        <input type="text" name="area" placeholder="Área o departamento" value={formulario.area} onChange={handleChange} required />
        <input type="text" name="institucion" placeholder="Institución" value={formulario.institucion} onChange={handleChange} required />
        <input type="text" name="pais" placeholder="País" value={formulario.pais} onChange={handleChange} required />
        <input type="text" name="ciudad" placeholder="Ciudad" value={formulario.ciudad} onChange={handleChange} required />
        <input type="password" name="contrasena" placeholder="Contraseña" value={formulario.contrasena} onChange={handleChange} required />

        <button type="submit">Solicitar acceso</button>
      </form>

      {mensaje && <p style={{ marginTop: "1rem", color: "#2c3e50" }}>{mensaje}</p>}
    </div>
  );
}

export default RegistroColaborador;
