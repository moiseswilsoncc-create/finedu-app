// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axiosConfig"; // ✅ usamos el cliente configurado

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", { correo, clave }); // ✅ usamos api

      if (response.data.success && response.data.usuario) {
        const { nombre, correo: correoUsuario, tipoUsuario } = response.data.usuario;

        localStorage.setItem("logueado", "true");
        localStorage.setItem("tipoUsuario", tipoUsuario || "usuario");
        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("correoUsuario", correoUsuario);

        navigate(tipoUsuario === "colaborador" ? "/panel-colaborador" : "/panel-usuario");
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
      console.error("Error en login:", err);
    }
  };

  const handleRecuperarClave = () => {
    navigate("/recuperar-clave");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h3>🔐 Inicio de sesión</h3>

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
          placeholder="Clave personal"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        {error && <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>{error}</p>}
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2980b9",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={handleRecuperarClave}
          style={{
            background: "none",
            border: "none",
            color: "#3498db",
            cursor: "pointer",
            fontSize: "0.95rem"
          }}
        >
          ¿Olvidaste tu clave?
        </button>
      </form>
    </div>
  );
}

export default Login;

