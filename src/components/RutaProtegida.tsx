import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

const RutaProtegida = ({ children }: Props) => {
  const logueado = localStorage.getItem("logueado") === "true";

  return logueado ? children : <Navigate to="/acceso-usuarios" />;
};

export default RutaProtegida;
