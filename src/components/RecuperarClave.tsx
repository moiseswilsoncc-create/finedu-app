// src/components/RecuperarClave.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // ✅ usamos Supabase directo

const RecuperarClave: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      // 1. Validar si el correo existe en la tabla usuarios
      const { data: usuario, error: errorBusqueda } = await supabase
        .from("usuarios")
        .select("id")
        .eq("correo", correo)
        .single();

      if (errorBusqueda || !usuario) {
        navigate("/error-acceso", {
          state: { mensaje: "❌ Este correo no está registrado en Finedu.", origen: "login" }
        });
        return;
      }

      // 2. Enviar correo de recuperación con Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(correo, {
        redirectTo: "https://finedu-app.vercel.app/nueva-clave"
      });

      if (error) {
        navigate("/error-acceso", {
          state: { mensaje: "❌ No se pudo enviar el correo de recuperación.", origen: "login" }
        });
        return;
      }

      // ✅ Éxito
      setEnviado(true);

    } catch (err) {
      console.error("Error inesperado:", err);
      navigate("/error-acceso", {
        state: { mensaje: "❌ Error inesperado al intentar recuperar la clave.", origen: "login" }
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#fefefe",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}
    >
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        🔁 Recuperar clave
      </h3>

      {!enviado ? (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder="Correo registrado en Finedu"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={{
              padding: "0.6rem",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
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
            {enviando ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>
      ) : (
        <p style={{ fontSize: "1.1rem", color: "#2ecc71" }}>
<<<<<<< HEAD
          ✅ Hemos enviado un enlace temporal a <strong>{correo}</strong>.  
          Revisa tu bandeja de entrada y sigue las instrucciones para crear una nueva clave.
=======
          Hemos enviado un enlace temporal a <strong>{correo}</strong>. Revisa tu
          bandeja de entrada y sigue las instrucciones para crear una nueva
          clave.
>>>>>>> Unificación de campo contraseña → clave en todos los módulos de usuario
        </p>
      )}
    </div>
  );
};

export default RecuperarClave;
