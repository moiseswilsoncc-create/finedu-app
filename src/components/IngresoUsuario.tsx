import React, { useState, useEffect } from "react";
import { DatosUsuario } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Asegúrate de tenerlo configurado

type Props = {
  setPais: (pais: string) => void;
};

function IngresoUsuario({ setPais }: Props) {
  const [datos, setDatos] = useState<DatosUsuario>({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    pais: "",
    ciudad: "",
    comuna: "",
    correo: "",
    clave: ""
  });

  const [registrado, setRegistrado] = useState(false);
  const [correoValido, setCorreoValido] = useState(true);
  const [camposCompletos, setCamposCompletos] = useState(false);
  const [claveValida, setClaveValida] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const todosCompletos = Object.values(datos).every(valor => valor.trim() !== "");
    setCamposCompletos(todosCompletos);
    setClaveValida(datos.clave.length === 6);
  }, [datos]);

  useEffect(() => {
    const validarCorreo = async () => {
      if (!datos.correo) return;
      const { data, error } = await supabase
        .from("correos_autorizados")
        .select("correo")
        .eq("correo", datos.correo)
        .single();

      setCorreoValido(!!data && !error);
    };

    validarCorreo();
  }, [datos.correo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    if (name === "pais") setPais(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!camposCompletos || !correoValido || !claveValida) return;

    const response = await fetch("/api/hash-clave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave: datos.clave })
    });

    const { claveHasheada } = await response.json();

    const { error } = await supabase.from("usuarios").insert([
      {
        nombre: datos.nombre,
        apellido: datos.apellido,
        fechaNacimiento: datos.fechaNacimiento,
        pais: datos.pais,
        ciudad: datos.ciudad,
        comuna: datos.comuna,
        correo: datos.correo,
        clave: claveHasheada,
        fechaRegistro: new Date().toISOString()
      }
    ]);

    if (!error) {
      setRegistrado(true);
      localStorage.setItem("correoUsuario", datos.correo);
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "usuario");
      localStorage.setItem("nombreUsuario", datos.nombre);
      navigate("/panel-usuario");
    } else {
      console.error("Error al registrar usuario:", error.message);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "2rem",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🧍 Registro de usuario solicitante</h3>

      {!registrado ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="text" name="nombre" placeholder="Nombre" value={datos.nombre} onChange={handleChange} />
          <input type="text" name="apellido" placeholder="Apellido" value={datos.apellido} onChange={handleChange} />
          <input type="date" name="fechaNacimiento" value={datos.fechaNacimiento} onChange={handleChange} />
          <select name="pais" value={datos.pais} onChange={handleChange}>
            <option value="">Selecciona tu país</option>
            <option value="Chile">Chile</option>
            <option value="Perú">Perú</option>
            <option value="México">México</option>
            <option value="Colombia">Colombia</option>
          </select>
          <input type="text" name="ciudad" placeholder="Ciudad" value={datos.ciudad} onChange={handleChange} />
          <input type="text" name="comuna" placeholder="Comuna" value={datos.comuna} onChange={handleChange} />
          <input type="email" name="correo" placeholder="Correo electrónico" value={datos.correo} onChange={handleChange} />
          <input type="password" name="clave" placeholder="Clave personal (4 dígitos)" value={datos.clave} onChange={handleChange} />

          {!correoValido && (
            <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>
              Este correo no está autorizado por Finedu. Verifica con tu institución.
            </p>
          )}

          {!claveValida && (
            <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>
              La clave debe tener exactamente 4 dígitos.
            </p>
          )}

          {!camposCompletos && (
            <p style={{ color: "#e67e22", fontSize: "0.95rem" }}>
              Por favor completa todos los campos antes de continuar.
            </p>
          )}

          <button type="submit" disabled={!camposCompletos || !correoValido || !claveValida} style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: (!camposCompletos || !correoValido || !claveValida) ? "#ccc" : "#2980b9",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: (!camposCompletos || !correoValido || !claveValida) ? "not-allowed" : "pointer"
          }}>
            Registrarse
          </button>
        </form>
      ) : (
        <div>
          <p style={{ fontSize: "1.1rem", color: "#2ecc71" }}>
            ¡Gracias por registrarte, {datos.nombre} {datos.apellido}! Tu perfil ha sido creado para operar desde <strong>{datos.ciudad}, {datos.comuna}</strong>.
          </p>

          <Link to="/editar-perfil">
            <button
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#2980b9",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Editar perfil
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default IngresoUsuario;
