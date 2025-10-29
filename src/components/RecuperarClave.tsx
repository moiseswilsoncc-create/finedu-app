import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

function RecuperarClave() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const listaAutorizada = [
    "usuario@finedu.cl",
    "colaborador@finedu.cl",
    "admin@finedu.cl"
    // Puedes ampliar esta lista o conectarla a una API
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo.includes("@")) {
      setError("Por favor ingresa un correo válido.");
      return;
    }

    if (!listaAutorizada.includes(correo)) {
      setError("Este correo no está autorizado por Finedu.");
      return;
    }

    try {
      const response = await axios.post("/recuperar-clave", { correo });

      if (response.data.success) {
        setEnviado(true);
        setError("");
        console.log("Enlace de recuperación enviado a:", correo);

        // Simulación: redirige con token ficticio
        setTimeout(() => {
          navigate(`/nueva-clave?token=${response.data.token}&correo=${correo}`);
        }, 2000);
      } else {
        setError("❌ El correo no está registrado.");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "3rem auto",
      padding: "2rem",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🔁 Recuperar contraseña</h3>

      {!enviado ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Correo institucional"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          {error && <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>{error}</p>}

          <button type="submit" style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
            Enviar enlace de recuperación
          </button>
        </form>
      ) : (
        <p style={{ fontSize: "1.1rem", color: "#2ecc71" }}>
          Hemos enviado un enlace temporal a <strong>{correo}</strong>. Revisa tu bandeja de entrada y sigue las instrucciones para crear una nueva contraseña.
        </p>
      )}
    </div>
  );
}

export default RecuperarClave;
