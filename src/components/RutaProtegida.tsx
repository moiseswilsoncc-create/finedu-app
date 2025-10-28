import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

const RutaProtegida = ({ children }: Props) => {
  const location = useLocation();

  const logueado = localStorage.getItem("logueado") === "true";
  const correo = localStorage.getItem("correo");
  const rol = localStorage.getItem("rol"); // 🔒 Preparado para validación por rol

  const sesionValida = logueado && correo;

  if (!sesionValida) {
    return <Navigate to="/login-usuario" state={{ from: location }} replace />;
  }

  // 🔒 Aquí podrías agregar lógica adicional por rol si se requiere:
  // if (rol !== "usuario") return <Navigate to="/login-usuario" replace />;

  return children;
};

export default RutaProtegida;
