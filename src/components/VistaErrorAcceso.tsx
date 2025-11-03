// src/components/VistaErrorAcceso.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VistaErrorAcceso: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { mensaje?: string; origen?: string };
  const mensaje = state?.mensaje;
  const origen = state?.origen; // "registro" o "login"

  return (
    <div
      role="alert"
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2rem",
        border: "1px solid #e74c3c",
        borderRadius: "12px",
        textAlign: "center",
        backgroundColor: "#fef2f2",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ color: "#e74c3c" }}>⚠️ Error en el acceso</h2>
      <p style={{ fontSize: "1.1rem", marginTop: "1rem", color: "#c0392b" }}>
        {mensaje || "No pudimos validar tus credenciales o completar el registro."}
      </p>
      <p style={{ marginTop: "1rem", color: "#7f8c8d" }}>
        Verifica tus datos e inténtalo nuevamente.
        {origen === "login" && " Si el problema persiste, utiliza la opción de recuperación de clave."}
      </p>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center"
        }}
      >
        <button
          onClick={() => {
            if (origen === "registro") {
              navigate("/registro-usuario");
            } else {
              navigate("/login-usuario");
            }
          }}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Volver a intentar
        </button>

        {origen === "login" && (
          <button
            onClick={() => navigate("/recuperar-clave")}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: "#e67e22",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Recuperar clave
          </button>
        )}
      </div>
    </div>
  );
};

export default VistaErrorAcceso;
