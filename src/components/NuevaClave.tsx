// src/components/NuevaClave.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../axiosConfig"; // ✅ cliente axios configurado

const NuevaClave: React.FC = () => {
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");
  const correo = params.get("correo");
  const esColaborador = correo?.includes("colaborador");

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
      const response = await api.post("/nueva-clave", {
        token,
        correo,
        nuevaClave // 🔐 hashing en backend
      });

      if (response.data.success) {
        setMensaje("✅ Contraseña actualizada correctamente.");

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
      } else {
        navigate("/error-acceso", {
          state: { mensaje: "❌ No se pudo actualizar la contraseña.", origen: "login" }
        });
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      navigate("/error-acceso", {
        state: { mensaje: "No se pudo conectar con el servidor.", origen: "login" }
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
        🔒 Crear nueva contraseña
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
          placeholder="Confirmar contraseña"
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
          {enviando ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
};

export default NuevaClave;
