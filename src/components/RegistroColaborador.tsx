import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const RegistroColaborador: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rol, setRol] = useState("");
  const [area, setArea] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [pais, setPais] = useState("Chile");
  const [ciudad, setCiudad] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("✅ Componente RegistroColaborador montado");
  }, []);

  const validarFormato = () => {
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!correoValido) {
      setError("Este correo no es válido. Por favor, intenta de nuevo.");
      return false;
    }
    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validarFormato()) return;

    try {
      // 1. Validar invitación institucional
      const { data: invitacion, error: errorInvitacion } = await supabase
        .from("ofertas_colaborador")
        .select("*")
        .eq("correo", correo)
        .single();

      if (errorInvitacion || !invitacion) {
        setError("❌ No tienes autorización institucional para registrarte.");
        return;
      }

      // 2. Insertar en tabla colaboradores
      const { data: colaboradoresData, error: errorColaboradores } = await supabase
        .from("colaboradores")
        .insert([
          {
            nombre,
            apellido,
            rol,
            area,
            institucion,
            pais,
            ciudad,
            correo,
            contrasena,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (errorColaboradores || !colaboradoresData || !colaboradoresData[0]?.id) {
        console.error("❌ Error al insertar en colaboradores:", errorColaboradores?.message);
        setError("No se pudo registrar el colaborador. Intenta más tarde.");
        return;
      }

      const nuevoColaborador = colaboradoresData[0];

      // 3. Insertar en tabla colaboradores_activos
      const { error: errorActivos } = await supabase
        .from("colaboradores_activos")
        .insert([
          {
            colaborador_id: nuevoColaborador.id,
            correo,
            nombre: `${nombre} ${apellido}`,
            rol,
            pais,
            institucion,
            activo: true,
            fecha_activacion: new Date().toISOString()
          }
        ]);

      if (errorActivos) {
        console.error("❌ Error al insertar en colaboradores_activos:", errorActivos.message);
        setError("Error al registrar la activación del colaborador.");
        return;
      }

      // 4. Guardar en localStorage y redirigir
      localStorage.setItem("nombreColaborador", `${nombre} ${apellido}`);
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "colaborador");
      localStorage.setItem("correoColaborador", correo);

      alert("✅ Registro de colaborador exitoso!");
      navigate("/vista-ingreso-colaborador");
    } catch (err) {
      console.error("❌ Error general:", err);
      setError("Error de conexión con Supabase.");
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
      <h2 style={{ textAlign: "center", color: "#3498db", marginBottom: "1rem" }}>📝 Registro de Colaborador</h2>
      <p style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.05rem", color: "#555" }}>
        Solo colaboradores autorizados por la institución pueden registrarse.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div><label>👤 Nombre</label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={inputStyle} /></div>
        <div><label>👤 Apellido</label><input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required style={inputStyle} /></div>
        <div><label>🎭 Rol</label><input type="text" value={rol} onChange={(e) => setRol(e.target.value)} required style={inputStyle} /></div>
        <div><label>🏢 Área</label><input type="text" value={area} onChange={(e) => setArea(e.target.value)} required style={inputStyle} /></div>
        <div><label>🏫 Institución</label><input type="text" value={institucion} onChange={(e) => setInstitucion(e.target.value)} required style={inputStyle} /></div>
        <div><label>🌎 País</label><input type="text" value={pais} onChange={(e) => setPais(e.target.value)} required style={inputStyle} /></div>
        <div><label>🏙️ Ciudad</label><input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required style={inputStyle} /></div>
        <div><label>📧 Correo electrónico</label><input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={inputStyle} /></div>
        <div><label>🔒 Clave personal</label><input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required style={inputStyle} /></div>
        <button type="submit" style={{
          padding: "0.8rem",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: "pointer"
        }}>✅ Registrarme ahora</button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "0.3rem"
};

export default RegistroColaborador;
