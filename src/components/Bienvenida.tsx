import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Bienvenida: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Si no estamos en "/", no mostrar nada
  if (location.pathname !== "/") return null;

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <img src="/logo.png" alt="Logo Finedu" style={{ width: "150px", marginBottom: "1rem" }} />
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Bienvenido a Finedu</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Tu plataforma de autonomía financiera y colaboración educativa
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={() => {
            localStorage.setItem("tipoUsuario", "usuario");
            navigate("/usuario");
          }}
        >
          👤 Ingresar como usuario
        </button>
        <button
          onClick={() => {
            localStorage.setItem("tipoUsuario", "colaborador");
            navigate("/colaborador");
          }}
        >
          🤝 Ingresar como colaborador
        </button>
        <button
          onClick={() => {
            localStorage.setItem("tipoUsuario", "institucional");
            navigate("/institucional");
          }}
        >
          🏛️ Vista institucional
        </button>
      </div>
    </div>
  );
};

export default Bienvenida;
