import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const RegistroColaborador: React.FC = () => {
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    pais: "Chile",
    rol: "editor"
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    const nuevoColaborador = {
      ...formulario,
      fecha_ingreso: new Date().toISOString().split("T")[0],
      activo: true
    };

    const { error } = await supabase.from("colaboradores").insert([nuevoColaborador]);

    if (error) {
      setMensaje("❌ Error al registrar colaborador.");
      console.error(error);
    } else {
      setMensaje("✅ Colaborador registrado correctamente.");
      setFormulario({
        nombre: "",
        correo: "",
        pais: "Chile",
        rol: "editor"
      });
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "2rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🧑‍💼 Registro de colaborador</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre completo" required style={inputStyle} />
        <input type="email" name="correo" value={formulario.correo} onChange={handleChange} placeholder="Correo institucional" required style={inputStyle} />
        <input type="text" name="pais" value={formulario.pais} onChange={handleChange} placeholder="País" required style={inputStyle} />
        <select name="rol" value={formulario.rol} onChange={handleChange} required style={inputStyle}>
          <option value="editor">Editor</option>
          <option value="analista">Analista</option>
          <option value="gestor">Gestor</option>
        </select>
        <button type="submit" style={{ padding: "0.8rem", backgroundColor: "#2980b9", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", cursor: "pointer" }}>
          Registrar colaborador
        </button>
      </form>
      {mensaje && (
        <p style={{ marginTop: "1rem", textAlign: "center", color: mensaje.includes("✅") ? "green" : "red" }}>
          {mensaje}
        </p>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

export default RegistroColaborador;
