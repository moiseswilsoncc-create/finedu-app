import React, { useState } from "react";
import RegistroAhorro from "./RegistroAhorro";
import AhorroGrupal from "./AhorroGrupal";

const PanelAhorro: React.FC = () => {
  const [modo, setModo] = useState("individual");
  const correoUsuario = localStorage.getItem("correo") || "";

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2>💼 Panel de Ahorro</h2>
      <p>Gestiona tus aportes personales o crea grupos de ahorro colaborativo.</p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label><strong>Modo:</strong> </label>
        <select value={modo} onChange={(e) => setModo(e.target.value)}>
          <option value="individual">Ahorro personal</option>
          <option value="grupal">Ahorro grupal</option>
        </select>
      </div>

      {modo === "individual" && <RegistroAhorro />}
      {modo === "grupal" && (
        <AhorroGrupal pais="Chile" usuarioActual={correoUsuario} />
      )}
    </div>
  );
};

export default PanelAhorro;
