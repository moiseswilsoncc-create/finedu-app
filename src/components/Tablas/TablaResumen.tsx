// 📦 src/components/Tablas/TablaResumen.tsx
// 🔄 Componente institucional para mostrar tablas resumidas con estilo profesional

import React from "react";

interface TablaResumenProps {
  titulo?: string;
  datos: (string | number)[][];
}

const TablaResumen: React.FC<TablaResumenProps> = ({ titulo, datos }) => {
  return (
    <div style={{ marginBottom: "2rem" }}>
      {titulo && (
        <h3 style={{
          marginBottom: "1rem",
          color: "#2c3e50",
          fontSize: "1.2rem"
        }}>
          {titulo}
        </h3>
      )}

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 0 4px rgba(0,0,0,0.05)",
        borderRadius: "6px",
        overflow: "hidden"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#ecf0f1" }}>
            {datos[0].map((_, index) => (
              <th key={index} style={{
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #ccc",
                fontWeight: "bold",
                color: "#34495e"
              }}>
                {`Columna ${index + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, filaIndex) => (
            <tr key={filaIndex}>
              {fila.map((celda, celdaIndex) => (
                <td key={celdaIndex} style={{
                  padding: "0.75rem",
                  borderBottom: "1px solid #ddd",
                  color: celdaIndex === 0 ? "#2c3e50" : "#555"
                }}>
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaResumen;
