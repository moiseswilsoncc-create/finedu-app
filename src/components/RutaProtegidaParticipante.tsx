import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

const RutaProtegidaParticipante = ({ children }: Props) => {
  const location = useLocation();

  const logueado = localStorage.getItem('logueado') === 'true';
  const correo = localStorage.getItem('correo');
  const rol = localStorage.getItem('rol');

  const sesionValida = logueado && correo && rol === 'participante';

  if (!sesionValida) {
    return <Navigate to="/login-usuario" state={{ from: location }} replace />;
  }

  return children;
};

export default RutaProtegidaParticipante;
