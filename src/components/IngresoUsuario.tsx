import React, { useState, useEffect } from "react";
import { DatosUsuario } from "../types";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

type Props = {
  setPais: (pais: string) => void;
};

const IngresoUsuario: React.FC<Props> = ({ setPais }) => {
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

  const [correoValido, setCorreoValido] = useState(true);
  const [camposCompletos, setCamposCompletos] = useState(false);
  const [claveValida, setClaveValida] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const todosCompletos = Object.values(datos).every((valor) => valor.trim() !== "");
    setCamposCompletos(todosCompletos);
    setClaveValida(datos.clave.length >= 6);
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
    setDatos((prev) => ({ ...prev, [name]: value }));
    if (name === "pais") setPais(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!camposCompletos) {
      navigate("/error-acceso", { state: { mensaje: "Por favor completa todos los campos." } });
      return;
    }
    if (!correoValido) {
      navigate("/error-acceso", { state: { mensaje: "Este correo no está autorizado por Finedu." } });
      return;
    }
    if (!claveValida) {
      navigate("/error-acceso", { state: { mensaje: "La clave debe tener al menos 6 caracteres." } });
      return;
    }

    setEnviando(true);

    try {
      // 1) Hash de la clave
      const resp = await fetch("/api/hash-clave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clave: datos.clave })
      });
      if (!resp.ok) throw new Error("Error al hashear clave");
      const { claveHasheada } = await resp.json();

      // 2) Insert en Supabase
      const { error } = await supabase.from("usuarios").insert([{
        nombre: datos.nombre,
        apellido: datos.apellido,
        fechaNacimiento: datos.fechaNacimiento,
        pais: datos.pais,
        ciudad: datos.ciudad,
        comuna: datos.comuna,
        correo: datos.correo,
        clave: claveHasheada,
        fechaRegistro: new Date().toISOString()
      }]);

      if (error) {
        navigate("/error-acceso", { state: { mensaje: error.message } });
        return;
      }

      // ✅ Guardar sesión mínima
      localStorage.setItem("correoUsuario", datos.correo);
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "usuario");
      localStorage.setItem("nombreUsuario", datos.nombre);

      // 🚀 Redirigir a pantalla de éxito
      navigate("/registro-exitoso");

    } catch (err: any) {
      navigate("/error-acceso", { state: { mensaje: "Error inesperado al registrar." } });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "600px", margin: "3rem auto", display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <h3 style={{ color: "#2c3e50" }}>🧍 Registro de usuario solicitante</h3>
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
      <input
        type="password"
        name="clave"
        placeholder="Clave personal (mínimo 6 caracteres)"
        value={datos.clave}
        onChange={handleChange}
      />
      <button
        type="submit"
        disabled={!camposCompletos || !correoValido || !claveValida || enviando}
        style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: (!camposCompletos || !correoValido || !claveValida || enviando) ? "#ccc" : "#2980b9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: (!camposCompletos || !correoValido || !claveValida || enviando) ? "not-allowed" : "pointer"
        }}
      >
        {enviando ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
};

export default IngresoUsuario;
