import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginUsuario = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de validación básica
    if (correo === 'usuario@finedu.cl' && clave === 'clave123') {
      navigate('/panel-usuario');
    } else {
      alert('Correo o clave incorrectos');
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
