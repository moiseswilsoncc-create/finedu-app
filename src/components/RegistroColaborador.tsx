import React, { useState } from "react";

function RegistroColaborador() {
  console.log("🧪 Renderizando RegistroColaborador");

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    rol: "",
    area: "",
    institucion: "",
    pais: "Chile",
    ciudad: "",
    contrasena: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📤 Datos del formulario:", formulario);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🧪 Test de visibilidad: Registro de Colaborador</h2>
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
        <input type="text" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} />
        <input type="text" name="apellido" placeholder="Apellido" value={formulario.apellido} onChange={handleChange} />
        <input type="text" name="rol" placeholder="Rol" value={formulario.rol} onChange={handleChange} />
        <input type="text" name="area" placeholder="Área" value={formulario.area} onChange={handleChange} />
        <input type="text" name="institucion" placeholder="Institución" value={formulario.institucion} onChange={handleChange} />
        <input type="text" name="pais" placeholder="País" value={formulario.pais} onChange={handleChange} />
        <input type="text" name="ciudad" placeholder="Ciudad" value={formulario.ciudad} onChange={handleChange} />
        <input type="password" name="contrasena" placeholder="Contraseña" value={formulario.contrasena} onChange={handleChange} />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default RegistroColaborador;
