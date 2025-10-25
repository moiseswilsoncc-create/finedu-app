import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginColaborador: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const navigate = useNavigate();

  const correoAutorizado = "colaborador@finedu.cl";
  const claveInicial = "clave-temporal";

  const validarCredenciales = (correo: string, clave: string) => {
    return correo === correoAutorizado && clave === claveInicial;
  };

  const enviarCorreoRecuperacion = (correo: string) => {
    console.log(`📩 Enviando correo de recuperación a ${correo}`);
    // Aquí iría la lógica real de envío
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (validarCredenciales(correo, clave)) {
      localStorage.setItem("tipoUsuario", "colaborador");
      localStorage.setItem("logueado", "true");
      localStorage.setItem("nombreUsuario", "Colaborador Finedu");
      navigate("/panel-colaborador");
    } else {
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);

      if (nuevosIntentos >= 3) {
        enviarCorreoRecuperacion(correo);
        alert("Hemos enviado un enlace de recuperación a tu correo institucional.");
      } else {
        alert("Correo o clave incorrectos. Este acceso es solo para colaboradores autorizados.");
      }
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "3rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "12px",
      backgroundColor: "#fefefe",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h2 style={{ color: "#3498db" }}>🔐 Acceso colaborador</h2>
      <p style={{ marginBottom: "1rem" }}>
        Este acceso es exclusivo para colaboradores autorizados por Finedu.
      </p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo institucional"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          style={{ width: "100%", padding: "0.6rem", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Clave temporal"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
          style={{ width: "100%", padding: "0.6rem", marginBottom: "1rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginColaborador;
