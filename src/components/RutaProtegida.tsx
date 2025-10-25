import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

const RutaProtegida = ({ children }: Props) => {
  const location = useLocation();
  const logueado = localStorage.getItem("logueado") === "true";
  const correo = localStorage.getItem("correoUsuario");

  const sesionValida = logueado && correo;

  return sesionValida ? children : <Navigate to="/login-usuario" state={{ from: location }} replace />;
};

export default RutaProtegida;
