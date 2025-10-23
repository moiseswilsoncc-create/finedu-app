import React from "react";

interface TablaResumenProps {
  titulo?: string;
  datos: (string | number)[][];
}

const TablaResumen: React.FC<TablaResumenProps> = ({ titulo, datos }) => {
  return (
    <div style={{ marginBottom: "2rem" }}>
      {titulo && <h3 style={{ marginBottom: "1rem" }}>{titulo}</h3>}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 0 4px rgba(0,0,0,0.1)"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#e0e0e0" }}>
            {datos[0].map((_, index) => (
              <th key={index} style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #ccc" }}>
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
                  color: celdaIndex === 0 ? "#333" : "#555"
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
