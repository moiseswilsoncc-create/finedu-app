import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/login", {
        correo,
        contraseña,
      });

      if (response.data.success) {
        localStorage.setItem("logueado", "true");
        localStorage.setItem("tipoUsuario", "usuario");

        setLogueado(true);
        setError("");
        console.log("Usuario autenticado:", response.data.usuario);
        navigate("/usuario");
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
      console.error(err);
    }
  };

  const handleRecuperarClave = () => {
    navigate("/recuperar-clave");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h3>🔐 Inicio de sesión</h3>

      {!logueado ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Ingresar</button>
          <button
            type="button"
            onClick={handleRecuperarClave}
            style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      ) : (
        <p>¡Bienvenido de nuevo, {correo}!</p>
      )}
    </div>
  );
}

export default Login;
