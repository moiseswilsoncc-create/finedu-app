import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: JSX.Element;
  usuario: {
    correo?: string;
    rol?: string;
    logueado?: boolean;
  };
};

const RutaColaborador = ({ children, usuario }: Props) => {
  const location = useLocation();

  const sesionValida =
    usuario?.logueado === true &&
    usuario?.correo &&
    usuario?.rol === "colaborador";

  return sesionValida
    ? children
    : <Navigate to="/login-colaborador" state={{ from: location }} replace />;
};

export default RutaColaborador;
