import { useNavigate } from "react-router-dom";

function VistaIngresoUsuario() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Bienvenido al portal de usuarios</h2>
      <p>¿Qué deseas hacer?</p>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/login")} style={{ marginRight: "1rem" }}>
          🔐 Iniciar sesión
        </button>
        <button onClick={() => navigate("/registro-usuario")}>
          🆕 Crear nuevo usuario
        </button>
      </div>
    </div>
  );
}

export default VistaIngresoUsuario;
