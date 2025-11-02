import React from "react";
import { Link } from "react-router-dom";

const Egresos: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <p>Selecciona una categoría de gastos para registrar tus egresos.</p>

      <ul style={{ listStyle: "none", padding: 0, lineHeight: "2rem" }}>
        <li><Link to="/egresos/hogar">🏠 Gasto de Hogar</Link></li>
        <li><Link to="/egresos/abarrotes">🛒 Abarrotes</Link></li>
        <li><Link to="/egresos/aseo">🧼 Aseo</Link></li>
        <li><Link to="/egresos/cuidado-personal">🧴 Cuidado Personal</Link></li>
        <li><Link to="/egresos/vestuario">👕 Vestuario</Link></li>
        <li><Link to="/egresos/frutas-verduras">🍎 Frutas y Verduras</Link></li>
        <li><Link to="/egresos/carnes">🍖 Carnes</Link></li>
        <li><Link to="/egresos/auto">🚗 Auto</Link></li>
        <li><Link to="/egresos/mascota">🐶 Mascota</Link></li>
        <li><Link to="/egresos/salud">🏥 Salud</Link></li>
        <li><Link to="/egresos/viajes">✈️ Viajes</Link></li>
        <li><Link to="/egresos/educacion">🎓 Educación</Link></li>
        <li><Link to="/egresos/entretenimiento">🎉 Entretenimiento</Link></li>
        <li><Link to="/egresos/seguros">🛡️ Seguros</Link></li>
        <li><Link to="/egresos/regalos">🎁 Regalos y Donaciones</Link></li>
        <li><Link to="/egresos/mantenimiento">🛠️ Mantenimiento</Link></li>
        <li><Link to="/egresos/tecnologia">📡 Tecnología</Link></li>
        <li><Link to="/egresos/creditos">💳 Créditos y Deudas</Link></li>
      </ul>
    </div>
  );
};

export default Egresos;
