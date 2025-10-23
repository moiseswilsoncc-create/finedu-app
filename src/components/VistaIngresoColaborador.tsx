import { useNavigate } from "react-router-dom";

function VistaIngresoColaborador() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Bienvenido al portal de colaboradores</h2>
      <p>¿Qué deseas hacer?</p>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/login")} style={{ marginRight: "1rem" }}>
          🔐 Iniciar sesión
        </button>
        <button onClick={() => navigate("/registro-colaborador")}>
          🆕 Solicitar acceso como colaborador
        </button>
      </div>
    </div>
  );
}

export default VistaIngresoColaborador;
