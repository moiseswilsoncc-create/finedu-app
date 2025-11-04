import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const RegistroUsuario: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [pais, setPais] = useState("Chile");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Componente RegistroUsuario montado");
  }, []);

  const validarFormato = () => {
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!correoValido) {
      navigate("/error-acceso", {
        state: { mensaje: "Este correo no es válido. Intenta de nuevo.", origen: "registro" }
      });
      return false;
    }
    if (clave.length < 6) {
      navigate("/error-acceso", {
        state: { mensaje: "La clave debe tener al menos 6 caracteres.", origen: "registro" }
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormato()) return;

    try {
      const grupoId = localStorage.getItem("grupoId") || null;

      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: errorAuth } = await supabase.auth.signUp({
        email: correo,
        password: clave,
      });

      console.log("Resultado signUp:", authData, errorAuth);

      if (errorAuth) {
        navigate("/error-acceso", {
          state: { mensaje: "Error al registrar en Auth: " + errorAuth.message, origen: "registro" }
        });
        return;
      }

      if (!authData.user) {
        navigate("/error-acceso", {
          state: { mensaje: "El usuario no se creó en Auth. Revisa tu correo para confirmar la cuenta.", origen: "registro" }
        });
        return;
      }

      const authUserId = authData.user.id;

      // 2. Insertar en tabla usuarios
      const { data: usuariosData, error: errorUsuarios } = await supabase
        .from("usuarios")
        .insert([
          {
            id: authUserId,
            nombre,
            apellido,
            fechaNacimiento,
            sexo,
            pais,
            ciudad,
            comuna,
            correo,
            grupo_id: grupoId,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      console.log("Resultado inserción usuarios:", usuariosData, errorUsuarios);

      if (errorUsuarios || !usuariosData || !usuariosData[0]?.id) {
        navigate("/error-acceso", {
          state: { mensaje: "No se pudo registrar el usuario en la tabla usuarios.", origen: "registro" }
        });
        return;
      }

      const nuevoUsuario = usuariosData[0];

      // 3. Insertar en tabla usuarios_activos
      const { error: errorActivos } = await supabase
        .from("usuarios_activos")
        .insert([
          {
            usuario_id: nuevoUsuario.id,
            correo,
            nombre: `${nombre} ${apellido}`,
            rol: "usuario",
            pais,
            comuna,
            grupo_id: grupoId,
            esActivo: true,
            fechaNacimiento
          }
        ]);

      console.log("Resultado inserción usuarios_activos:", errorActivos);

      if (errorActivos) {
        navigate("/error-acceso", {
          state: { mensaje: "Error al registrar la activación del usuario.", origen: "registro" }
        });
        return;
      }

      // Guardar en localStorage y redirigir
      localStorage.setItem("nombreUsuario", `${nombre} ${apellido}`);
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "usuario");
      localStorage.setItem("correoUsuario", correo);
      if (grupoId) localStorage.setItem("grupoId", grupoId);

      navigate("/registro-exitoso");
    } catch (err) {
      console.error("❌ Error general:", err);
      navigate("/error-acceso", {
        state: { mensaje: "Error de conexión con Supabase.", origen: "registro" }
      });
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "2rem",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#3498db", marginBottom: "1rem" }}>📝 Ficha de ingreso</h2>
      <p style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.05rem", color: "#555" }}>
        Regístrate gratis y comienza a construir tu autonomía financiera con Finedu.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label>👤 Nombre</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label>👤 Apellido</label>
          <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label>📅 Fecha de nacimiento</label>
          <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label>Sexo</label>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} required style={inputStyle}>
            <option value="">Selecciona</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
          </select>
        </div>
        <div>
          <label>🌎 País</label>
          <input type="text" value={pais} onChange={(e) => setPais(e.target.value)} required style={inputStyle} />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label>🏙️ Ciudad</label>
            <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>🏘️ Comuna</label>
            <input type="text" value={comuna} onChange={(e) => setComuna(e.target.value)} required style={inputStyle} />
          </div>
        </div>
        <div>
          <label>📧 Correo electrónico</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label>🔒 Clave personal</label>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required style={inputStyle} />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.8rem",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          ✅ Registrarme ahora
        </button>
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "0.3rem"
};

export default RegistroUsuario;
