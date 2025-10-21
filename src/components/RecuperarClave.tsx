import React, { useState } from "react";

function RecuperarClave() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo.includes("@")) {
      setError("Por favor ingresa un correo válido.");
      return;
    }

    // Simulación de envío de enlace de recuperación
    setEnviado(true);
    setError("");
    console.log("Enlace de recuperación enviado a:", correo);
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>🔁 Recuperar contraseña</h3>

      {!enviado ? (
        <form onSubmit={handleSubmit}>
          <label>
            Correo electrónico:
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </label>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Enviar enlace de recuperación</button>
        </form>
      ) : (
        <p>
          Hemos enviado un enlace temporal a <strong>{correo}</strong>. Revisa tu bandeja de entrada y sigue las instrucciones para crear una nueva contraseña.
        </p>
      )}
    </div>
  );
}

export default RecuperarClave;
