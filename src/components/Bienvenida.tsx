import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Bienvenida: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (tipo === "usuario") navigate("/usuario");
    else if (tipo === "colaborador") navigate("/colaborador");
    else if (tipo === "institucional") navigate("/institucional");
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <img src="/logo.png" alt="Logo Finedu" style={{ width: "150px", marginBottom: "1rem" }} />
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Bienvenido a Finedu</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Tu plataforma de autonomía financiera y colaboración educativa
      </p>
      <button
        onClick={() => navigate("/login")}
        style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}
      >
        Comenzar
      </button>
    </div>
  );
};

export default Bienvenida;
