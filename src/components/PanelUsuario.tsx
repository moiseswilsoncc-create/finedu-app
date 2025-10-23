import React from "react";
import { Link } from "react-router-dom";

const PanelUsuario: React.FC = () => {
  const nombre = localStorage.getItem("nombreUsuario") || "Usuario";
  const correo = localStorage.getItem("correoUsuario") || "";

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ color: "#2ecc71", textAlign: "center" }}>👋 Bienvenido, {nombre}</h2>
      <p style={{ textAlign: "center", marginBottom: "0.5rem", fontStyle: "italic" }}>
        Sesión activa como <strong>{correo}</strong>
      </p>
      <p style={{ textAlign: "center", marginBottom: "2rem" }}>
        Este es tu espacio en <strong>Finedu</strong>. Desde aquí puedes acceder a todas tus herramientas.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
        <Link to="/usuario">
          <button style={estiloBoton}>🎯 Simuladores</button>
        </Link>
        <Link to="/editar-perfil">
          <button style={estiloBoton}>📝 Editar perfil</button>
        </Link>
        <Link to="/foro">
          <button style={estiloBoton}>💬 Comunidad</button>
        </Link>
        <Link to="/usuario#metas">
          <button style={estiloBoton}>📈 Mis metas</button>
        </Link>
      </div>
    </div>
  );
};

const estiloBoton: React.CSSProperties = {
  padding: "1rem 2rem",
  fontSize: "1rem",
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  minWidth: "180px",
  textAlign: "center"
};

export default PanelUsuario;
