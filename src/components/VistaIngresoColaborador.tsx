import { Link } from "react-router-dom";

function VistaIngresoColaborador() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Bienvenido al portal de colaboradores</h2>
      <p>¿Qué deseas hacer?</p>
      <div style={{ marginTop: "1rem" }}>
        <Link to="/login">
          <button style={{ marginRight: "1rem" }}>🔐 Iniciar sesión</button>
        </Link>
        <Link to="/registro-colaborador">
          <button>🆕 Crear nuevo colaborador</button>
        </Link>
      </div>
    </div>
  );
}

export default VistaIngresoColaborador;
