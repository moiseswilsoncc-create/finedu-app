import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

const RutaAdministrador = ({ children }: Props) => {
  const location = useLocation();

  const logueado = localStorage.getItem("logueado") === "true";
  const correo = localStorage.getItem("correo");
  const rol = localStorage.getItem("rol");

  const sesionValida = logueado && correo && rol === "admin";

  return sesionValida
    ? children
    : <Navigate to="/login-admin" state={{ from: location }} replace />;
};

export default RutaAdministrador;
