// src/components/NuevaClave.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const NuevaClave: React.FC = () => {
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const correo = params.get("correo");
  const esColaborador = correo?.includes("colaborador");

  // 🔎 Validar que exista un access_token en la URL
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) {
      navigate("/error-acceso", {
        state: { mensaje: "El enlace de recuperación no es válido o ha expirado.", origen: "login" }
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔎 Validaciones
    if (esColaborador && nuevaClave.length < 8) {
      navigate("/error-acceso", {
        state: { mensaje: "La clave para colaboradores debe tener al menos 8 caracteres.", origen: "login" }
      });
      return;
    }

    if (!esColaborador && nuevaClave.length < 6) {
      navigate("/error-acceso", {
        state: { mensaje: "La clave para usuarios debe tener al menos 6 caracteres.", origen: "login" }
      });
      return;
    }

    if (nuevaClave !== confirmacion) {
      navigate("/error-acceso", {
        state: { mensaje: "Las contraseñas no coinciden.", origen: "login" }
      });
      return;
    }

    setEnviando(true);

    try {
      // ✅ Actualizar clave directamente en Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        password: nuevaClave,
      });

      console.log("Resultado updateUser:", data, error);

      if (error) {
        navigate("/error-acceso", {
          state: { mensaje: "No se pudo actualizar la clave: " + error.message, origen: "login" }
        });
        return;
      }

      setMensaje("✅ Clave actualizada correctamente. Redirigiendo...");

      // Guardar sesión mínima
      localStorage.setItem("logueado", "true");
      localStorage.setItem("nombreUsuario", correo?.split("@")[0] || "Usuario Finedu");

      if (esColaborador) {
        localStorage.setItem("tipoUsuario", "colaborador");
        setTimeout(() => navigate("/panel-colaborador"), 2000);
      } else {
        localStorage.setItem("tipoUsuario", "usuario");
        setTimeout(() => navigate("/panel-usuario"), 2000);
      }

    } catch (err) {
      console.error("❌ Error inesperado:", err);
      navigate("/error-acceso", {
        state: { mensaje: "Error inesperado al intentar actualizar la clave.", origen: "login" }
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
        🔒 Crear nueva clave
      </h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="password"
          placeholder={esColaborador ? "Mínimo 8 caracteres" : "Mínimo 6 caracteres"}
          value={nuevaClave}
          onChange={(e) => setNuevaClave(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar clave"
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          required
        />

        {mensaje && (
          <p style={{ color: "#2ecc71", fontSize: "0.95rem" }}>{mensaje}</p>
        )}

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
          {enviando ? "Actualizando..." : "Actualizar clave"}
        </button>
      </form>
    </div>
  );
};

export default NuevaClave;
