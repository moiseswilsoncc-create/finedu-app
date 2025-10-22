import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <Link to="/ingreso-usuario">
          <button style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}>
            👤 Ingresar como usuario
          </button>
        </Link>
        <Link to="/ingreso-colaborador">
          <button style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}>
            🤝 Ingresar como colaborador
          </button>
        </Link>
        <Link to="/institucional">
          <button style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}>
            🏛️ Vista institucional
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Bienvenida;
