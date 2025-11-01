import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LoginUsuario: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const enviarCorreoRecuperacion = async (correo: string) => {
    try {
      await fetch("/api/enviar-recuperacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo })
      });
      console.log(`📩 Enviado correo de recuperación a ${correo}`);
    } catch (err) {
      console.error("Error al enviar correo de recuperación:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 Validación estricta: clave numérica de 4 dígitos
    if (!/^\d{4}$/.test(clave)) {
      setError("La clave debe ser numérica y de 4 dígitos.");
      return;
    }

    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email: correo,
      password: clave
    });

    if (supabaseError) {
      const mensaje = supabaseError.message || "";
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);

      if (nuevosIntentos >= 3) {
        await enviarCorreoRecuperacion(correo);
        setError("Hemos enviado un enlace de recuperación a tu correo registrado.");
      } else if (mensaje.includes("Invalid login credentials")) {
        setError("Correo o clave incorrectos. Intenta nuevamente.");
      } else {
        setError("Error inesperado: " + mensaje);
      }

      return;
    }

    // ✅ Guardar sesión mínima en localStorage
    localStorage.setItem("logueado", "true");
    localStorage.setItem("tipoUsuario", "usuario");
    localStorage.setItem("correoUsuario", correo);

    const nombreExtraido = correo.split("@")[0];
    localStorage.setItem("nombreUsuario", nombreExtraido);

    // 🚀 Redirigir al panel de usuario
    navigate("/panel-usuario");
  };

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
          placeholder="Clave personal (4 dígitos)"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        {error && (
          <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>{error}</p>
        )}
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginUsuario;
