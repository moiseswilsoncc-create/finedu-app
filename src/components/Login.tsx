import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (correo === "" || contraseña === "") {
      setError("Por favor completa todos los campos.");
      return;
    }

    // Simulación de validación exitosa
    setLogueado(true);
    setError("");
    console.log("Usuario autenticado:", correo);
  };

  const handleRecuperarClave = () => {
    navigate("/recuperar-clave");
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>🔐 Inicio de sesión</h3>

      {!logueado ? (
        <form onSubmit={handleSubmit}>
          <label>
            Correo electrónico:
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </label>

          <label>
            Contraseña:
            <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
          </label>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Ingresar</button>

          <p style={{ marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={handleRecuperarClave}
              style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        </form>
      ) : (
        <p>¡Bienvenido de nuevo, {correo}!</p>
      )}
    </div>
  );
}

export default Login;
