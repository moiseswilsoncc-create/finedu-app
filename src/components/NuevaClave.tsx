import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

function NuevaClave() {
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [actualizado, setActualizado] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Simulación de token temporal

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Enlace inválido o expirado.");
      return;
    }

    if (nuevaClave.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nuevaClave !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Simulación de actualización exitosa
    setActualizado(true);
    setError("");
    console.log("Contraseña actualizada con token:", token);
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>🔒 Crear nueva contraseña</h3>

      {!actualizado ? (
        <form onSubmit={handleSubmit}>
          <label>
            Nueva contraseña:
            <input type="password" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} required />
          </label>

          <label>
            Confirmar contraseña:
            <input type="password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} required />
          </label>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Actualizar contraseña</button>
        </form>
      ) : (
        <p>✅ Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tu nueva clave.</p>
      )}
    </div>
  );
}

export default NuevaClave;
