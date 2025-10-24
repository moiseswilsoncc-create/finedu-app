import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VistaIngresoColaborador: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Si deseas simular acceso directo como colaborador, puedes activar esto:
    // localStorage.setItem("tipoUsuario", "colaborador");
    // localStorage.setItem("logueado", "true");
    // navigate("/colaborador", { replace: true });
  }, []);

  return (
    <div style={{
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "12px",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#3498db" }}>👥 Bienvenido al portal de colaboradores</h2>
      <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
        Este espacio está diseñado para quienes acompañan a otros en su camino financiero.
      </p>
      <p style={{ marginTop: "1rem" }}>
        Puedes iniciar sesión con tu cuenta de colaborador o crear una nueva si aún no la tienes.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/login")}
          style={{
            marginRight: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔐 Iniciar sesión
        </button>
        <button
          onClick={() => navigate("/registro-colaborador")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#f39c12",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🆕 Crear nuevo colaborador
        </button>
      </div>
    </div>
  );
};

export default VistaIngresoColaborador;
