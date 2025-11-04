import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LoginUsuario: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clave.length < 6) {
      navigate("/error-acceso", { state: { mensaje: "La clave debe tener al menos 6 caracteres.", origen: "acceso" } });
      return;
    }

    setEnviando(true);

    try {
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email: correo,
        password: clave
      });

      if (supabaseError) {
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);

        if (nuevosIntentos >= 3) {
          // 🔒 Bloqueo y envío de correo de recuperación
          await supabase.auth.resetPasswordForEmail(correo, {
            redirectTo: "https://finedu-app.vercel.app/reset-clave"
          });
          navigate("/error-acceso", {
            state: { mensaje: "Has superado el número de intentos. Te enviamos un correo para restablecer tu clave.", origen: "acceso" }
          });
          return;
        }

        navigate("/error-acceso", { state: { mensaje: "Correo o clave incorrectos. Intenta nuevamente.", origen: "acceso" } });
        return;
      }

      // ✅ Guardar sesión mínima
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "usuario");
      localStorage.setItem("correoUsuario", correo);
      localStorage.setItem("nombreUsuario", correo.split("@")[0]);

      // 🚀 Redirigir al panel de usuario
      navigate("/panel-usuario");

    } catch (err: any) {
      navigate("/error-acceso", { state: { mensaje: "Error inesperado al intentar iniciar sesión.", origen: "acceso" } });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        maxWidth: "400px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#fefefe",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
    >
      <h3 style={{ color: "#2c3e50" }}>🔐 Acceso de usuario</h3>
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
  );
};

export default LoginUsuario;
