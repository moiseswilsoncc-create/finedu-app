import React from "react";
import { useNavigate } from "react-router-dom";

function MenuSimuladores() {
  const navigate = useNavigate();

  const simuladores = [
    {
      titulo: "Simuladores de crédito",
      submodulos: [
        { nombre: "Crédito de consumo", ruta: "/simuladores/credito/consumo" },
        { nombre: "Crédito automotriz", ruta: "/simuladores/credito/auto" },
        { nombre: "Crédito hipotecario", ruta: "/simuladores/credito/vivienda" },
      ],
    },
    {
      titulo: "Simuladores de ahorro e inversión",
      submodulos: [
        { nombre: "Comparador de ahorro", ruta: "/simuladores/ahorro/comparador" },
      ],
    },
  ];

  return (
    <div>
      <h2>Simuladores financieros</h2>
      {simuladores.map((grupo, index) => (
        <div key={index}>
          <h4>{grupo.titulo}</h4>
          <ul>
            {grupo.submodulos.map((modulo, i) => (
              <li key={i}>
                <button onClick={() => navigate(modulo.ruta)}>
                  {modulo.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default MenuSimuladores;
