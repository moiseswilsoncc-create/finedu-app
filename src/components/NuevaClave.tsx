import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, useSearchParams } from "react-router-dom";

function NuevaClave() {
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");
  const correo = params.get("correo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nuevaClave.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaClave !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.post("/nueva-clave", {
        token,
        correo,
        nuevaClave,
      });

      if (response.data.success) {
        setMensaje("✅ Contraseña actualizada correctamente.");
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("❌ No se pudo actualizar la contraseña.");
        setMensaje("");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor.");
      setMensaje("");
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>🔒 Crear nueva contraseña</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nueva contraseña:
          <input type="password" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} required />
        </label>

        <label>
          Confirmar contraseña:
          <input type="password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} required />
        </label>

        {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Actualizar contraseña</button>
      </form>
    </div>
  );
}

export default NuevaClave;
