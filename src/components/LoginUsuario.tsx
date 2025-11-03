import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LoginUsuario: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState<"ok"|"error"|"info">("info");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    // 🔐 Validación estricta: mínimo 6 caracteres
    if (clave.length < 6) {
      setMensaje("La clave debe tener al menos 6 caracteres.");
      setMensajeTipo("error");
      return;
    }

    setEnviando(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: correo,
        password: clave
      });

      if (supabaseError) {
        console.error("Error de login:", supabaseError.message);
        if (supabaseError.message.includes("Invalid login credentials")) {
          setMensaje("Correo o clave incorrectos. Intenta nuevamente.");
        } else {
          setMensaje("Error inesperado: " + supabaseError.message);
        }
        setMensajeTipo("error");
        setEnviando(false);
        return;
      }

      // ✅ Guardar sesión mínima en localStorage
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "usuario");
      localStorage.setItem("correoUsuario", correo);

      const nombreExtraido = correo.split("@")[0];
      localStorage.setItem("nombreUsuario", nombreExtraido);

      // 🚀 Redirigir al panel de usuario
      setMensaje("¡Bienvenido! Redirigiendo a tu panel…");
      setMensajeTipo("ok");
      navigate("/panel-usuario");
    } catch (err: any) {
      console.error("Error inesperado:", err);
      setMensaje("Error inesperado al intentar iniciar sesión.");
      setMensajeTipo("error");
    } finally {
      setEnviando(false);
    }
  };

  const colorMensaje =
    mensajeTipo === "ok" ? "#2ecc71" :
    mensajeTipo === "error" ? "#e74c3c" :
    "#2c3e50";

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#fefefe",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        🔐 Acceso para usuarios registrados
      </h2>

      {mensaje && (
        <p style={{ color: colorMensaje, fontSize: "0.95rem", marginBottom: "1rem" }}>
          {mensaje}
        </p>
      )}

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Clave personal (mínimo 6 caracteres)"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={enviando}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: enviando ? "#ccc" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: enviando ? "not-allowed" : "pointer"
          }}
        >
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
};

export default LoginUsuario;
