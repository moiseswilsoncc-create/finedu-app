import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LoginColaborador: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      // Buscar colaborador en la tabla
      const { data: colaborador, error: errorBusqueda } = await supabase
        .from("colaboradores")
        .select("id, correo, clave, nombreResponsable, institucion, pais")
        .eq("correo", correo)
        .single();

      if (errorBusqueda || !colaborador) {
        setError("❌ Correo no encontrado o no autorizado.");
        setCargando(false);
        return;
      }

      // Comparar clave (⚠️ en producción debería ser hash)
      if (colaborador.clave !== clave) {
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);
        setCargando(false);

        if (nuevosIntentos >= 3) {
          setError("Has superado el número de intentos. Contacta a tu institución.");
        } else {
          setError("❌ Clave incorrecta. Intenta nuevamente.");
        }
        return;
      }

      // Guardar sesión en localStorage
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "colaborador");
      localStorage.setItem("correoColaborador", colaborador.correo);
      localStorage.setItem("nombreColaborador", colaborador.nombreResponsable);
      localStorage.setItem("institucionColaborador", colaborador.institucion);
      localStorage.setItem("paisColaborador", colaborador.pais);

      alert("✅ Bienvenido, colaborador!");
      navigate("/dashboard-institucional");
    } catch (err) {
      console.error("❌ Error general en login colaborador:", err);
      setError("Error de conexión con Supabase.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "3rem auto",
      padding: "2rem",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🔐 Acceso para colaboradores</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Correo institucional"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Clave personal"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        {error && <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>{error}</p>}
        <button type="submit" disabled={cargando} style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: cargando ? "#bdc3c7" : "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: cargando ? "not-allowed" : "pointer"
        }}>
          {cargando ? "Verificando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
};

export default LoginColaborador;
