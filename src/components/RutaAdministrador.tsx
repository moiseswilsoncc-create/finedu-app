import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: JSX.Element;
  usuario: {
    correo?: string;
    rol?: string;
    logueado?: boolean;
  };
};

const RutaAdministrador = ({ children, usuario }: Props) => {
  const location = useLocation();

  const sesionValida =
    usuario?.logueado === true &&
    usuario?.correo &&
    usuario?.rol === "admin";

  return sesionValida
    ? children
    : <Navigate to="/login-admin" state={{ from: location }} replace />;
};

export default RutaAdministrador;
