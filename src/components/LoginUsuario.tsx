import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginUsuario = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const navigate = useNavigate();

  const validarCredenciales = (correo: string, clave: string) => {
    // Simulación de validación básica
    return correo === 'usuario@finedu.cl' && clave === 'clave123';
  };

  const enviarCorreoRecuperacion = (correo: string) => {
    console.log(`📩 Enviando correo de recuperación a ${correo}`);
    // Aquí iría la lógica real de envío
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (validarCredenciales(correo, clave)) {
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "usuario");
      localStorage.setItem("nombreUsuario", "Usuario Finedu");
      navigate('/panel-usuario');
    } else {
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);

      if (nuevosIntentos >= 3) {
        enviarCorreoRecuperacion(correo);
        alert("Hemos enviado un enlace de recuperación a tu correo registrado.");
      } else {
        alert("Correo o clave incorrectos. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Acceso para usuarios registrados</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Clave personal"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <button type="submit" className="btn-principal">Ingresar</button>
      </form>
    </div>
  );
};

export default LoginUsuario;
