import React from "react";

const Bienvenida: React.FC = () => {
  console.log("✅ Componente Bienvenida montado");

  return (
    <div style={{ padding: "2rem", fontSize: "1.5rem", textAlign: "center" }}>
      ✅ Bienvenida mínima funcionando
    </div>
  );
};

export default Bienvenida;
