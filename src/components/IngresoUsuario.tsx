import React, { useState, useEffect } from "react";
import { DatosUsuario } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState<"ok"|"error"|"warning"|"info">("info");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const todosCompletos = Object.values(datos).every((valor) => valor.trim() !== "");
    setCamposCompletos(todosCompletos);
    // Validación alineada con Supabase Auth: mínimo 6 caracteres
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

      const esAutorizado = !!data && !error;
      setCorreoValido(esAutorizado);

      if (!esAutorizado) {
        setMensaje("Este correo no está autorizado por Finedu. Verifica con tu institución.");
        setMensajeTipo("warning");
      } else {
        setMensaje("");
      }
    };

    validarCorreo();
  }, [datos.correo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
    if (name === "pais") setPais(value);
  };

  const limpiarFicha = () => {
    setDatos({
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      pais: "",
      ciudad: "",
      comuna: "",
      correo: "",
      clave: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones previas visibles
    if (!camposCompletos) {
      setMensaje("Por favor completa todos los campos antes de continuar.");
      setMensajeTipo("warning");
      return;
    }
    if (!correoValido) {
      setMensaje("Este correo no está autorizado por Finedu. Verifica con tu institución.");
      setMensajeTipo("warning");
      return;
    }
    if (!claveValida) {
      setMensaje("La clave debe tener al menos 6 caracteres.");
      setMensajeTipo("warning");
      return;
    }

    setEnviando(true);
    setMensaje("");
    setMensajeTipo("info");

    // 1) Hash de la clave en backend propio
    let claveHasheada: string | null = null;
    try {
      const resp = await fetch("/api/hash-clave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clave: datos.clave })
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Fallo al hashear clave: ${txt || resp.status}`);
      }

      const json = await resp.json();
      claveHasheada = json?.claveHasheada;
      if (!claveHasheada) throw new Error("No se recibió 'claveHasheada' del servidor.");
    } catch (err: any) {
      console.error("Error en hash-clave:", err);
      setMensaje("Error al preparar tu registro. Intenta nuevamente en unos minutos.");
      setMensajeTipo("error");
      setEnviando(false);
      return;
    }

    // 2) Insert en tabla usuarios (perfil extendido)
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .insert([
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
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        setMensaje(
          error.message?.toLowerCase().includes("duplicate")
            ? "Este correo ya se encuentra registrado. Prueba con otro o recupera tu acceso."
            : `No pudimos registrar tu usuario: ${error.message}`
        );
        setMensajeTipo("error");
        setEnviando(false);
        return;
      }

      // Éxito: limpiar ficha, persistir sesión mínima y redirigir inmediatamente
      setRegistrado(true);
      setMensaje("¡Registro exitoso! Redirigiendo a tu panel…");
      setMensajeTipo("ok");

      // Limpia la ficha para evitar que queden datos visibles
      limpiarFicha();

      // Persistencia mínima
      localStorage.setItem("correoUsuario", datos.correo);
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "usuario");
      localStorage.setItem("nombreUsuario", datos.nombre);

      // Redirección inmediata al panel de usuario
      navigate("/panel-usuario");
    } catch (err: any) {
      console.error("Error inesperado registrando usuario:", err);
      setMensaje("Error inesperado al registrar tu usuario. Intenta nuevamente.");
      setMensajeTipo("error");
    } finally {
      setEnviando(false);
    }
  };

  const colorMensaje =
    mensajeTipo === "ok" ? "#2ecc71" :
    mensajeTipo === "error" ? "#e74c3c" :
    mensajeTipo === "warning" ? "#e67e22" :
    "#2c3e50";

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#fefefe",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🧍 Registro de usuario solicitante</h3>

      {/* Mensaje global */}
      {mensaje && (
        <p style={{ color: colorMensaje, fontSize: "0.95rem", marginBottom: "1rem" }}>
          {mensaje}
        </p>
      )}

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
      ) : (
        <div>
          <p style={{ fontSize: "1.1rem", color: "#2ecc71" }}>
            ¡Gracias por registrarte! Redirigiendo a tu panel…
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
